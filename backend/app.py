# NOVA backend (nonpublic - not deployed)
# FastAPI: link resolution (incl. short links), media extraction, one-tap download proxy, MP3/GIF conversion.
from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, HTMLResponse, RedirectResponse
import subprocess, tempfile, os, re, urllib.request, urllib.parse, json, socket, ipaddress, time, collections

app = FastAPI(title="NOVA API")
ORIGINS = [o.strip() for o in os.environ.get("NOVA_ORIGINS", "https://hady-6.github.io").split(",") if o.strip()]
TRIAL_KEY = os.environ.get("NOVA_TRIAL_KEY", "").strip()
# NOVA_PUBLIC=1: free public site. Opens only the rate-limited, allowlisted API paths; HTML pages and owner stats stay protected by their own keys.
PUBLIC = os.environ.get("NOVA_PUBLIC", "").strip() == "1"
# Download proxy + convert stay behind the site password even in public mode unless explicitly enabled (cost/terms decision).
PUBLIC_PROXY = os.environ.get("NOVA_PUBLIC_PROXY", "").strip() == "1"

from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.staticfiles import StaticFiles

import secrets as _secrets, hmac as _hmac
import hashlib as _hashlib, threading as _threading

_SESSIONS = {}  # token -> expiry epoch
_SESSION_TTL = 7 * 24 * 3600
_LOGIN_RL = collections.defaultdict(list)

_LOGIN_PAGE = """<!doctype html><html lang=ar dir=rtl><head><meta charset=utf-8>
<meta name=viewport content="width=device-width,initial-scale=1"><title>NOVA - تجربة خاصة</title>
<style>body{background:#0b1026;color:#e8ecff;font-family:system-ui;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
form{background:#171f45;padding:2rem;border-radius:1rem;display:flex;flex-direction:column;gap:1rem;width:min(90vw,340px)}
input{padding:.8rem;border-radius:.6rem;border:1px solid #333c77;background:#0b1026;color:#fff;font-size:1rem}
button{padding:.8rem;border:0;border-radius:.6rem;background:linear-gradient(135deg,#38bdf8,#a855f7);color:#fff;font-size:1rem;cursor:pointer}
p{margin:0;color:#f88;font-size:.9rem}</style></head>
<body><form method=post action=/login>
<b>نوفا - نسخة تجريبية خاصة</b>
<input type=password name=pw placeholder="كلمة السر" autocomplete=current-password required autofocus>
<button>دخول</button>{msg}</form></body></html>"""

def _valid_session(tok):
    exp = _SESSIONS.get(tok)
    if exp and exp > time.time():
        return True
    _SESSIONS.pop(tok, None)
    return False


SETUP_HTML = """<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NOVA - setup</title>
<style>body{font-family:system-ui;background:#0b0e1a;color:#e8ecf8;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
div{max-width:34rem;padding:2rem;text-align:center;line-height:1.9}code{background:#1b2140;padding:.15em .5em;border-radius:.4em;direction:ltr;display:inline-block}</style></head>
<body><div><h1>NOVA</h1>
<p>الإعداد ناقص: لازم تضبط متغير البيئة <code>NOVA_TRIAL_KEY</code> على الاستضافة (كلمة سر دخول الموقع)، وبعدها حدّث الصفحة.</p>
<p lang="en" dir="ltr">Setup incomplete: set the <code>NOVA_TRIAL_KEY</code> environment variable (the site password) on your host, then reload.</p>
</div></body></html>"""

class TrialGateMiddleware(BaseHTTPMiddleware):
    """When NOVA_TRIAL_KEY is set, everything except the login form requires a session cookie.
    The password only ever travels in a POST body - never in URLs, query strings, or logs."""
    async def dispatch(self, request, call_next):
        p_ = request.url.path
        if request.url.path == "/api/health":
            return await call_next(request)
        if PUBLIC and (p_ in ("/api/comments", "/api/react") or (PUBLIC_PROXY and p_ in ("/api/download", "/api/convert"))):
            return await call_next(request)
        if not TRIAL_KEY and not PUBLIC:
            # Fail closed: without NOVA_TRIAL_KEY the app must never serve ungated.
            if "text/html" in request.headers.get("accept", ""):
                return HTMLResponse(SETUP_HTML, status_code=503)
            return JSONResponse({"detail": "setup incomplete: NOVA_TRIAL_KEY is not set"}, status_code=503)
        p = request.url.path
        if p == "/login":
            return await call_next(request)
        # Counter API: public paths are open (free/no-login public app); owner stats
        # authenticate separately via X-Owner-Key inside the handlers.
        if p in ("/api/visit", "/api/stats/public", "/api/stats/owner", "/api/stats/backup", "/api/extract", "/api/rating", "/api/comments", "/api/react"):
            return await call_next(request)
        if _valid_session(request.cookies.get("nova_s", "")):
            return await call_next(request)
        if "text/html" in request.headers.get("accept", ""):
            return RedirectResponse("/login", status_code=303)
        return JSONResponse({"detail": "authentication required"}, status_code=401)

app.add_middleware(TrialGateMiddleware)
app.add_middleware(CORSMiddleware, allow_origins=ORIGINS, allow_methods=["GET", "POST"], allow_headers=["*"])

@app.get("/config.js")
def config_js():
    # Same-origin API for the trial deployment; GitHub Pages build ships BACKEND constant instead.
    body = "window.NOVA_BACKEND = location.origin;"
    return StreamingResponse(iter([body]), media_type="application/javascript")

# One-tap proxy/conversion is restricted to media CDNs of supported platforms (no open proxy).
ALLOWED_PROXY_SUFFIXES = (".pinimg.com", ".pinterest.com", "pinimg.com", "pinterest.com",
    ".twimg.com", "twimg.com", ".tiktokcdn.com", ".tiktokcdn-us.com", ".tiktokcdn-eu.com",
    ".tiktokd.org", ".tiktokd.net", ".tiktokv.com", ".tiktokv.us", ".tiktokw.us", ".muscdn.com")

def _host_allowed(url):
    try:
        h = urllib.parse.urlparse(url).hostname or ""
    except Exception:
        return False
    h = h.lower()
    if re.fullmatch(r"[0-9a-fA-F:.\[\]]+", h) and not re.search(r"[a-zA-Z]", h.replace(".", "")):
        return False  # bare IP literal
    return any(h == suf.lstrip(".") or h.endswith(suf) for suf in ALLOWED_PROXY_SUFFIXES)

def _public_host(url):
    """Reject URLs resolving to private/loopback/link-local/reserved addresses (SSRF guard)."""
    try:
        h = urllib.parse.urlparse(url).hostname
        if not h:
            return False
        for fam, _, _, _, sa in socket.getaddrinfo(h, None):
            ip = ipaddress.ip_address(sa[0])
            if not (ip.is_global):
                return False
        return True
    except Exception:
        return False

def _checked_url(url, max_hops=5):
    """https-only, allowlisted, public host; follow redirects manually with the same checks per hop."""
    cur = url
    for _ in range(max_hops):
        if not re.match(r"https://", cur) or not _host_allowed(cur) or not _public_host(cur):
            raise HTTPException(400, "url not allowed")
        # GET with Range 0-0 instead of HEAD: Pinterest's CDN answers 403 to HEAD with a browser UA but serves ranged GETs.
        req = urllib.request.Request(cur, headers={**UA, "Range": "bytes=0-0"})
        try:
            with _opener.open(req, timeout=15) as r:
                cr = r.headers.get("Content-Range", "")
                total = cr.split("/")[-1] if "/" in cr and cr.split("/")[-1].isdigit() else r.headers.get("Content-Length")
                return cur, total
        except urllib.error.HTTPError as e:
            loc = e.headers.get("Location")
            if e.code in (301, 302, 303, 307, 308) and loc:
                cur = urllib.parse.urljoin(cur, loc)
                if not re.match(r"https://(www\.|api\.)?(pinterest\.[a-z.]+|pin\.it|tiktok\.com|[a-z]+\.tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com)", cur, re.I):
                    raise HTTPException(400, "redirect target not allowed")
                continue
            raise HTTPException(502, f"upstream rejected: {e.code}")
    raise HTTPException(400, "too many redirects")

_RATE = collections.defaultdict(list)
TRUST_PROXY = os.environ.get("NOVA_TRUST_PROXY", "").strip() == "1"

def _client_ip(request):
    """Only trust X-Forwarded-For when NOVA_TRUST_PROXY=1 (set it on hosts like Railway that
    terminate TLS and forward the header). Otherwise the header is client-spoofable, so we
    use the direct peer address."""
    if TRUST_PROXY:
        xff = request.headers.get("x-forwarded-for", "")
        if xff:
            return xff.split(",")[0].strip()[:64]
    return request.client.host if request.client else "?"

def rate_limit(request, key, limit=20, window=60):
    ip = _client_ip(request)
    k = (ip, key)
    now = time.time()
    _RATE[k] = [ts for ts in _RATE[k] if now - ts < window]
    if len(_RATE[k]) >= limit:
        raise HTTPException(429, "rate limit")
    _RATE[k].append(now)

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"}
MAX_PROXY_BYTES = 200 * 1024 * 1024  # 200MB safety cap for free tier

def fetch_json(url, headers=None):
    req = urllib.request.Request(url, headers=headers or UA)
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode())

class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None

_opener = urllib.request.build_opener(_NoRedirect)

def resolve_short(u):
    """Follow redirects server-side for known short-link hosts (manual loop, handles 308)."""
    if not re.match(r"https?://(pin\.it|vt\.tiktok\.com|vm\.tiktok\.com)/", u, re.I):
        return u
    cur = u
    for _ in range(5):
        req = urllib.request.Request(cur, headers=UA, method="HEAD")
        try:
            with _opener.open(req, timeout=15) as r:
                return r.geturl()
        except urllib.error.HTTPError as e:
            loc = e.headers.get("Location")
            if e.code in (301, 302, 303, 307, 308) and loc:
                cur = urllib.parse.urljoin(cur, loc)
                continue
            # host may reject HEAD; fall back to GET
            req = urllib.request.Request(cur, headers=UA)
            with urllib.request.urlopen(req, timeout=15) as r:
                return r.geturl()
    return cur



def _extract_video_list(html):
    """Find the first video_list JSON object in pin page HTML via brace balancing.
    Matches both "video_list" and the "v_hlsv4_video_list" page variant."""
    i = html.find('video_list"')
    while i != -1:
        j = html.find("{", i)
        if j == -1:
            return None
        depth, k, in_str, esc = 0, j, False, False
        while k < len(html):
            c = html[k]
            if in_str:
                if esc: esc = False
                elif c == "\\": esc = True
                elif c == '"': in_str = False
            else:
                if c == '"': in_str = True
                elif c == "{": depth += 1
                elif c == "}":
                    depth -= 1
                    if depth == 0:
                        try:
                            return json.loads(html[j:k + 1])
                        except Exception:
                            break
            k += 1
        i = html.find('video_list"', i + 1)
    return None

def _probe_size(url):
    """Best-effort HEAD for Content-Length; None on any failure."""
    try:
        req = urllib.request.Request(url, headers=UA, method="HEAD")
        with _opener.open(req, timeout=5) as r:
            cl = r.headers.get("Content-Length")
            return int(cl) if cl and cl.isdigit() else None
    except Exception:
        return None

def finalize(source, title, u, media, thumbnail=None, duration=None):
    """Uniform extract response: per-row size (bytes|None) + ext, card thumbnail/duration."""
    import html as _html_entities
    title = _html_entities.unescape(title or "")
    for o in media:
        o.setdefault("size", None)
        o["ext"] = (os.path.splitext(urllib.parse.urlparse(o["url"]).path)[1].lstrip(".").lower()[:5]
                    or ("mp3" if o["kind"] == "audio" else ("jpg" if o["kind"] == "image" else "mp4")))
    from concurrent.futures import ThreadPoolExecutor
    need = [o for o in media[:8] if o["size"] is None]
    if need:
        with ThreadPoolExecutor(max_workers=6) as ex:
            sizes = list(ex.map(lambda o: _probe_size(o["url"]), need))
        for o, s in zip(need, sizes):
            o["size"] = s
    return {"source": source, "title": title, "thumbnail": thumbnail,
            "duration": duration, "resolved_url": u, "media": media}

def extract_media(u):
    u = resolve_short(u.strip())
    m = re.search(r"pinterest\.[a-z.]+/pin/(\d+)", u, re.I)
    if m:
        data = fetch_json(f"https://widgets.pinterest.com/v3/pidgets/pins/info/?pin_ids={m.group(1)}")
        pin = data["data"][0]
        if pin.get("error"):
            raise HTTPException(404, "pin not found")
        vids = (pin.get("videos") or {}).get("video_list") or {}
        imgs = pin.get("images") or {}
        if not vids:
            # Widgets API hides some pins' video data (HLS-only listings). Server-side we can
            # read the pin page HTML, which carries the full video_list incl. HLS variants.
            try:
                html = _checked_url(u) and urllib.request.urlopen(
                    urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=15).read().decode("utf-8", "replace")
                vids = _extract_video_list(html) or vids
            except Exception:
                vids = vids or {}
        out = [{"quality": k, "url": v["url"], "kind": "video"} for k, v in vids.items()
               if isinstance(v, dict) and v.get("url") and ".mp4" in v["url"] and "/hls/" not in v["url"]]
        if not out:
            # Derive the 720p MP4 twin of any HLS variant (same asset path, /hls/ -> /720p/, .m3u8 -> .mp4)
            # and keep it only if it actually serves.
            for k, v in vids.items():
                u2 = v.get("url") if isinstance(v, dict) else ""
                if u2 and "/hls/" in u2 and u2.endswith(".m3u8"):
                    cand = u2.replace("/hls/", "/720p/")[:-5] + ".mp4"
                    try:
                        req = urllib.request.Request(cand, method="HEAD", headers={"User-Agent": "Mozilla/5.0"})
                        if urllib.request.urlopen(req, timeout=10).status == 200:
                            out = [{"quality": "720p", "url": cand, "kind": "video"}]
                            break
                    except Exception:
                        pass
        if not out and imgs:
            cands = [v for v in imgs.values() if isinstance(v, dict) and v.get("url")]
            best = imgs.get("orig") or (max(cands, key=lambda v: v.get("width", 0)) if cands else None)
            if best:
                out = [{"quality": "original", "url": best["url"], "kind": "image"}]
        thumb = None
        try:
            thumb = max((v for v in imgs.values() if isinstance(v, dict) and v.get("url")),
                        key=lambda v: v.get("width", 0))["url"]
        except ValueError:
            pass
        if not pin.get("title"):
            t2 = (((pin.get("rich_metadata") or {}).get("title")) or (pin.get("description") or "")).strip()
            pin_title = (t2 or "Pinterest pin")[:120]
        else:
            pin_title = pin["title"]
        return finalize("pinterest", pin_title, u, out, thumbnail=thumb)
    if re.search(r"(tiktok\.com)", u, re.I):
        d = fetch_json("https://www.tikwm.com/api/?url=" + urllib.parse.quote(u, safe=""))
        if d.get("code") != 0:
            raise HTTPException(404, "tiktok video not found")
        data = d["data"]
        media = []
        if not data.get("images"):
            # Photo posts report a "play" URL that is really the soundtrack; only real videos get video rows.
            if data.get("hdplay"): media.append({"quality": "hd", "url": data["hdplay"], "kind": "video", "size": data.get("hd_size")})
            if data.get("play"): media.append({"quality": "sd", "url": data["play"], "kind": "video", "size": data.get("size")})
        if data.get("music"): media.append({"quality": "audio", "url": data["music"], "kind": "audio", "size": data.get("music_size")})
        if data.get("images"): media += [{"quality": f"image-{i+1}", "url": im, "kind": "image"} for i, im in enumerate(data["images"])]
        return finalize("tiktok", data.get("title") or "TikTok", u, media,
                        thumbnail=data.get("cover"), duration=data.get("duration"))
    if re.search(r"(twitter\.com|x\.com)/\S+/status/(\d+)", u, re.I):
        d = fetch_json("https://api.fxtwitter.com/" + re.sub(r"^https?://(www\.)?(twitter\.com|x\.com)/", "", u))
        t = d.get("tweet") or {}
        media = [{"quality": v.get("quality", "video"), "url": v["url"], "kind": "video"} for v in ((t.get("media") or {}).get("videos") or [])]
        media += [{"quality": "image", "url": p["url"], "kind": "image"} for p in ((t.get("media") or {}).get("photos") or [])]
        if not media:
            raise HTTPException(404, "no media in tweet")
        thumb = None
        vids = ((t.get("media") or {}).get("videos") or [])
        phots = ((t.get("media") or {}).get("photos") or [])
        if vids and vids[0].get("thumbnail_url"): thumb = vids[0]["thumbnail_url"]
        elif phots and phots[0].get("url"): thumb = phots[0]["url"]
        return finalize("x", (t.get("text") or "X post")[:120], u, media, thumbnail=thumb)
    if re.search(r"\.(mp4|webm|mov|m4v|mp3|gif|jpe?g|png|webp)(\?.*)?$", u, re.I):
        kind = "audio" if re.search(r"\.mp3(\?|$)", u, re.I) else ("image" if re.search(r"\.(gif|jpe?g|png|webp)(\?|$)", u, re.I) else "video")
        return finalize("direct", u.rsplit("/", 1)[-1][:80], u, [{"quality": "original", "url": u, "kind": kind}])
    raise HTTPException(400, "unsupported link")

@app.get("/login")
def login_form():
    return HTMLResponse(_LOGIN_PAGE.replace("{msg}", ""))

@app.post("/login")
async def login_submit(request: Request):
    ip = _client_ip(request)
    now = time.time()
    _LOGIN_RL[ip] = [ts for ts in _LOGIN_RL[ip] if now - ts < 60]
    if len(_LOGIN_RL[ip]) >= 5:
        return HTMLResponse(_LOGIN_PAGE.replace("{msg}", "<p>محاولات كتير - استنى دقيقة.</p>"), status_code=429)
    _LOGIN_RL[ip].append(now)
    body = (await request.body()).decode("utf-8", "replace")
    pw = urllib.parse.parse_qs(body).get("pw", [""])[0]
    if not (TRIAL_KEY and _hmac.compare_digest(pw, TRIAL_KEY)):
        return HTMLResponse(_LOGIN_PAGE.replace("{msg}", "<p>كلمة السر غلط.</p>"), status_code=401)
    tok = _secrets.token_urlsafe(32)
    _SESSIONS[tok] = now + _SESSION_TTL
    resp = RedirectResponse("/", status_code=303)
    secure = request.headers.get("x-forwarded-proto", request.url.scheme) == "https"
    resp.set_cookie("nova_s", tok, max_age=_SESSION_TTL, httponly=True, secure=secure, samesite="lax")
    return resp

@app.get("/api/health")
def health():
    return {"ok": True}

_RATINGS_PATH = os.environ.get("NOVA_RATINGS_PATH", "nova_ratings.json")
_RATINGS_LOCK = _threading.Lock()

def _load_ratings():
    try:
        with open(_RATINGS_PATH) as f:
            d = json.load(f)
        return d if isinstance(d, dict) else {}
    except Exception:
        return {}

def _save_ratings(d):
    tmp = _RATINGS_PATH + ".tmp"
    with open(tmp, "w") as f:
        json.dump(d, f)
    os.replace(tmp, _RATINGS_PATH)

def _rating_summary(per):
    votes = list(per.values())
    n = len(votes)
    return {"avg": (round(sum(votes) / n, 2)) if n else None, "count": n}

@app.get("/api/rating")
def get_rating(url: str = Query(..., min_length=1, max_length=500)):
    with _RATINGS_LOCK:
        per = _load_ratings().get(url.strip()[:500]) or {}
    return _rating_summary(per)

@app.post("/api/rating")
async def post_rating(request: Request):
    """Real local rating store: one changeable vote per visitor (hashed IP) per link.
    No accounts, no fake seed data - counts start at zero and grow only from actual votes."""
    rate_limit(request, "rate", limit=10, window=60)
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(400, "bad json")
    url = str(body.get("url") or "").strip()[:500]
    try:
        stars = int(body.get("stars"))
    except Exception:
        stars = 0
    if not url or not (1 <= stars <= 5):
        raise HTTPException(400, "bad rating")
    voter = _hmac.new((TRIAL_KEY or "nova").encode(), _client_ip(request).encode(), _hashlib.sha256).hexdigest()[:16]
    with _RATINGS_LOCK:
        allr = _load_ratings()
        if url not in allr and len(allr) >= 5000:
            allr.pop(next(iter(allr)))
        per = allr.setdefault(url, {})
        if voter not in per and len(per) >= 10000:
            raise HTTPException(429, "vote cap reached")
        per[voter] = stars
        _save_ratings(allr)
    out = _rating_summary(per)
    out["yours"] = stars
    return out

@app.get("/api/extract")
def extract(request: Request, url: str = Query(..., min_length=8, max_length=2000)):
    rate_limit(request, "extract", limit=30)
    return extract_media(url)

@app.get("/api/download")
def download(request: Request, url: str = Query(..., min_length=8, max_length=4000), name: str = Query("nova", max_length=80)):
    """Allowlisted media-CDN proxy with Content-Disposition: attachment -> true one-tap downloads (fixes pinimg CORS block). Not an open proxy."""
    rate_limit(request, "download", limit=30)
    _checked_url(url)
    safe_name = re.sub(r"[^A-Za-z0-9_.-]+", "_", name).strip("_") or "nova"
    ext = os.path.splitext(urllib.parse.urlparse(url).path)[1][:5] or ".mp4"
    req = urllib.request.Request(url, headers=UA)
    try:
        r = urllib.request.urlopen(req, timeout=30)
    except Exception as e:
        raise HTTPException(502, f"fetch failed: {e}")
    ctype = r.headers.get("Content-Type", "application/octet-stream")
    def stream():
        sent = 0
        with r:
            while True:
                chunk = r.read(256 * 1024)
                if not chunk:
                    break
                sent += len(chunk)
                if sent > MAX_PROXY_BYTES:
                    break
                yield chunk
    return StreamingResponse(stream(), media_type=ctype,
        headers={"Content-Disposition": f'attachment; filename="{safe_name}{ext}"',
                 "Content-Length": r.headers.get("Content-Length", "")} if r.headers.get("Content-Length") else
                {"Content-Disposition": f'attachment; filename="{safe_name}{ext}"'})

@app.get("/api/convert")
def convert(request: Request, url: str = Query(..., min_length=8, max_length=4000), to: str = Query("mp3", pattern="^(mp3|gif)$")):
    rate_limit(request, "convert", limit=6)
    _checked_url(url)
    work = tempfile.mkdtemp()
    src = os.path.join(work, "in.mp4")
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=60) as r, open(src, "wb") as f:
            got = 0
            while True:
                chunk = r.read(1024 * 1024)
                if not chunk:
                    break
                got += len(chunk)
                if got > 60 * 1024 * 1024:
                    raise HTTPException(413, "input too large (60MB cap)")
                f.write(chunk)
        if to == "mp3":
            out = os.path.join(work, "out.mp3")
            subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-vn", "-c:a", "libmp3lame", "-q:a", "4", out, "-y"], check=True, timeout=120)
            return FileResponse(out, media_type="audio/mpeg", filename="nova.mp3")
        out = os.path.join(work, "out.gif")
        subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-t", "8", "-vf", "fps=8,scale=360:-1:flags=lanczos", out, "-y"], check=True, timeout=120)
        return FileResponse(out, media_type="image/gif", filename="nova.gif")
    except Exception as e:
        raise HTTPException(502, f"conversion failed: {e}")

# ===================== COUNTERS (prep - private, activation deferred) =====================
# Semantics confirmed by owner 2026-10-26:
# - one persistent first-party cookie ID = one counted visitor across revisits
# - deleted cookie / new browser = counted again (intentional, no fingerprinting)
# - lifetime total is monotonic: never resets on month start or deploys
# - owner monthly/hourly aggregates are separate and never modify the total
import sqlite3 as _sqlite3

_COUNTER_DB = os.environ.get("NOVA_COUNTER_DB", os.path.join(os.path.dirname(os.path.abspath(__file__)), "nova_counters.db"))
_OWNER_KEY = os.environ.get("NOVA_OWNER_KEY", "").strip()
_CID_RE = re.compile(r"^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$")

def _cdb():
    con = _sqlite3.connect(_COUNTER_DB)
    con.execute("CREATE TABLE IF NOT EXISTS visitors(cid TEXT PRIMARY KEY, first_seen REAL, last_seen REAL, visits INTEGER DEFAULT 1)")
    con.execute("CREATE TABLE IF NOT EXISTS events(ts REAL, kind TEXT, cid TEXT, day TEXT, hour TEXT)")
    return con

def _require_owner(request: Request):
    if not _OWNER_KEY:
        raise HTTPException(503, "owner stats not configured (NOVA_OWNER_KEY unset)")
    if not _hmac.compare_digest(request.headers.get("x-owner-key", ""), _OWNER_KEY):
        raise HTTPException(403, "forbidden")

@app.post("/api/visit")
async def api_visit(request: Request):
    try:
        body = await request.json()
    except Exception:
        body = {}
    cid = str(body.get("cid", "")).lower()
    if not _CID_RE.match(cid):
        raise HTTPException(400, "invalid cid")
    now = time.time()
    con = _cdb()
    try:
        cur = con.execute("SELECT cid FROM visitors WHERE cid=?", (cid,))
        is_new = cur.fetchone() is None
        if is_new:
            con.execute("INSERT INTO visitors(cid, first_seen, last_seen, visits) VALUES(?,?,?,1)", (cid, now, now))
            kind = "first_seen"
        else:
            con.execute("UPDATE visitors SET last_seen=?, visits=visits+1 WHERE cid=?", (now, cid))
            kind = "pageview"
        day = time.strftime("%Y-%m-%d", time.gmtime(now))
        hour = time.strftime("%Y-%m-%d %H:00", time.gmtime(now))
        con.execute("INSERT INTO events(ts, kind, cid, day, hour) VALUES(?,?,?,?,?)", (now, kind, cid, day, hour))
        total = con.execute("SELECT COUNT(*) FROM visitors").fetchone()[0]
        con.commit()
        return {"total": total, "new": is_new}
    finally:
        con.close()

@app.get("/api/stats/public")
async def api_stats_public():
    con = _cdb()
    try:
        return {"total": con.execute("SELECT COUNT(*) FROM visitors").fetchone()[0]}
    finally:
        con.close()

@app.get("/api/stats/owner")
async def api_stats_owner(request: Request):
    _require_owner(request)
    con = _cdb()
    try:
        total = con.execute("SELECT COUNT(*) FROM visitors").fetchone()[0]
        monthly = con.execute("SELECT substr(day,1,7) AS m, SUM(kind='first_seen') AS new_visitors, COUNT(*) AS hits FROM events GROUP BY m ORDER BY m DESC LIMIT 24").fetchall()
        hourly = con.execute("SELECT hour, SUM(kind='first_seen') AS new_visitors, COUNT(*) AS hits FROM events GROUP BY hour ORDER BY hour DESC LIMIT 72").fetchall()
        return {
            "total": total,
            "monthly": [{"month": m, "new_visitors": n, "hits": h} for m, n, h in monthly],
            "hourly": [{"hour": hh, "new_visitors": n, "hits": h} for hh, n, h in hourly],
        }
    finally:
        con.close()

@app.get("/api/stats/backup")
async def api_stats_backup(request: Request):
    """Owner-gated JSON dump for the nightly/weekly offsite backup job.
    Restore rule: replay dump, then verify total >= last known public total (monotonic guard)."""
    _require_owner(request)
    con = _cdb()
    try:
        visitors = con.execute("SELECT cid, first_seen, last_seen, visits FROM visitors").fetchall()
        events = con.execute("SELECT ts, kind, cid, day, hour FROM events").fetchall()
        return {
            "dumped_at": time.time(),
            "visitors": [{"cid": c, "first_seen": f, "last_seen": l, "visits": v} for c, f, l, v in visitors],
            "events": [{"ts": t, "kind": k, "cid": c, "day": d, "hour": h} for t, k, c, d, h in events],
        }
    finally:
        con.close()



# ===================== COMMENTS + REACTIONS (real storage, starts empty) =====================
import sqlite3 as _sq3
_SOCIAL_DB = os.environ.get("NOVA_SOCIAL_DB", os.path.join(os.path.dirname(os.path.abspath(__file__)), "nova_social.db"))
_SOCIAL_LOCK = _threading.Lock()

def _sdb():
    c = _sq3.connect(_SOCIAL_DB)
    c.execute("CREATE TABLE IF NOT EXISTS comments(id INTEGER PRIMARY KEY, ts INTEGER, name TEXT, text TEXT)")
    c.execute("CREATE TABLE IF NOT EXISTS reactions(voter TEXT PRIMARY KEY, val INTEGER)")
    return c

def _voter(request):
    return _hmac.new((TRIAL_KEY or "nova").encode(), _client_ip(request).encode(), _hashlib.sha256).hexdigest()[:16]

@app.get("/api/comments")
def list_comments():
    with _SOCIAL_LOCK, _sdb() as c:
        rows = c.execute("SELECT ts,name,text FROM comments ORDER BY id DESC LIMIT 50").fetchall()
        up = c.execute("SELECT count(*) FROM reactions WHERE val=1").fetchone()[0]
        down = c.execute("SELECT count(*) FROM reactions WHERE val=-1").fetchone()[0]
    return {"comments": [{"ts": r[0], "name": r[1], "text": r[2]} for r in rows], "likes": up, "dislikes": down}

@app.post("/api/comments")
async def add_comment(request: Request):
    rate_limit(request, "comment", limit=5, window=60)
    try:
        b = await request.json()
    except Exception:
        raise HTTPException(400, "bad json")
    name = str(b.get("name") or "").strip()[:40] or "زائر"
    text = str(b.get("text") or "").strip()[:500]
    if not text:
        raise HTTPException(400, "empty comment")
    with _SOCIAL_LOCK, _sdb() as c:
        c.execute("INSERT INTO comments(ts,name,text) VALUES(?,?,?)", (int(time.time()), name, text))
    return {"ok": True}

@app.post("/api/react")
async def react(request: Request):
    rate_limit(request, "react", limit=10, window=60)
    try:
        b = await request.json()
        v = int(b.get("value"))
    except Exception:
        raise HTTPException(400, "bad request")
    if v not in (1, -1):
        raise HTTPException(400, "bad value")
    with _SOCIAL_LOCK, _sdb() as c:
        c.execute("INSERT OR REPLACE INTO reactions(voter,val) VALUES(?,?)", (_voter(request), v))
    return list_comments()

app.mount("/", StaticFiles(directory="static", html=True), name="site")
