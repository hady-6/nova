/* NOVA preview-cf: reviews panel (stars + comment + author + per-review likes). Preview only. */
(function () {
  var API = 'https://nova-api.alaziziya7.workers.dev';
  var T = {
    ar: { h: 'التقييمات والتعليقات', none: 'لسه محدش قيّم', cnt: '{n} تقييم', rate: 'تقييمك', name: 'اسمك (اختياري)', ph: 'اكتب رأيك (اختياري)', send: 'إرسال التقييم', upd: 'تحديث تقييمي', pick: 'اختر عدد النجوم أولًا', sending: 'جاري الإرسال...', ok: 'تم الإرسال', fail: 'تعذّر الإرسال، تأكد من الاتصال وحاول تاني', limit: 'محاولات كتير، استنى دقيقة وحاول تاني', mine: 'تقييمك', edited: 'معدّل', helpful: 'مفيد', own: 'لا يمكن الإعجاب بتقييمك', empty: 'لا توجد تقييمات بعد. كن أول من يقيّم.', priv: 'التقييمات والتعليقات والإعجابات محفوظة على الخادم وتظهر للجميع. بنستخدم معرّفًا عشوائيًا محفوظًا في متصفحك لتقييم واحد لكل زائر، وبنحفظ بصمة مُشفّرة لعنوان IP للحد من الإساءة.', loadfail: 'تعذّر تحميل التقييمات حاليًا', dl: '{n} ضغطة على زر التحميل', dlt: 'عدد مرات الضغط على زر التحميل، وليس تأكيدًا أن الملف اتحفظ على الجهاز', mod: 'مشرف', modpw: 'كلمة مرور المشرف', modon: 'دخول', modoff: 'خروج المشرف', modbad: 'كلمة المرور غير صحيحة', modoffl: 'المشرف غير مفعّل بعد', del: 'حذف', delq: 'حذف هذا التعليق نهائيًا؟', delfail: 'تعذّر الحذف' },
    en: { h: 'Ratings & reviews', none: 'No ratings yet', cnt: '{n} ratings', rate: 'Your rating', name: 'Your name (optional)', ph: 'Write your review (optional)', send: 'Submit review', upd: 'Update my review', pick: 'Pick a star rating first', sending: 'Sending...', ok: 'Sent', fail: 'Could not send. Check your connection and try again', limit: 'Too many attempts, wait a minute and try again', mine: 'Your review', edited: 'edited', helpful: 'Helpful', own: 'You cannot like your own review', empty: 'No reviews yet. Be the first.', priv: 'Reviews, comments and likes are stored on the server and visible to everyone. A random id kept in your browser allows one review per visitor, and a hashed form of your IP address helps limit abuse.', loadfail: 'Could not load reviews right now', dl: '{n} download button clicks', dlt: 'Counts clicks on the download button, not confirmed saved files', mod: 'Moderator', modpw: 'Moderator password', modon: 'Sign in', modoff: 'Sign out moderator', modbad: 'Wrong password', modoffl: 'Moderator is not set up yet', del: 'Delete', delq: 'Delete this review permanently?', delfail: 'Could not delete' }
  };
  var css = '#reviews-panel .rv-sum{display:flex;gap:18px;align-items:center;justify-content:center;flex-wrap:wrap;margin:6px 0 14px}' +
    '#reviews-panel .rv-big{font-size:44px;font-weight:700;line-height:1;text-align:center}#reviews-panel .rv-cnt{font-size:13px;opacity:.75;text-align:center}' +
    '#reviews-panel .rv-st{color:#ffd76a;letter-spacing:2px;direction:ltr;unicode-bidi:isolate}#reviews-panel .rv-st .off{opacity:.3}' +
    '#reviews-panel .rv-bars{min-width:150px;flex:1;max-width:260px;direction:ltr}#reviews-panel .rv-row{display:flex;align-items:center;gap:6px;font-size:12px;margin:3px 0}' +
    '#reviews-panel .rv-bar{flex:1;height:7px;border-radius:4px;background:rgba(128,140,200,.25);overflow:hidden}#reviews-panel .rv-bar i{display:block;height:100%;background:#ffd76a}' +
    '#reviews-panel form{margin:14px 0 6px}#reviews-panel .rv-pick{display:flex;gap:6px;justify-content:center;direction:ltr;margin:6px 0 10px}' +
    '#reviews-panel .rv-pick button{font-size:30px;width:48px;height:48px;line-height:1;border-radius:12px;border:1px solid var(--line,rgba(150,160,220,.35));background:transparent;color:rgba(150,160,200,.55);cursor:pointer;touch-action:manipulation}' +
    '#reviews-panel .rv-pick button.on{color:#ffd76a;border-color:rgba(255,215,106,.6)}' +
    '#reviews-panel input,#reviews-panel textarea{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:12px 14px;margin-top:8px;border-radius:12px;border:1px solid var(--line,rgba(150,160,220,.35));color:var(--ink,inherit);background:rgba(4,6,22,.55)}' +
    'html.light #reviews-panel input,html.light #reviews-panel textarea{background:#fff;color:#1a2040;border:1px solid rgba(26,32,64,.35)}' +
    '#reviews-panel input::placeholder,#reviews-panel textarea::placeholder{color:#aab4e0;opacity:1}html.light #reviews-panel input::placeholder,html.light #reviews-panel textarea::placeholder{color:#5a6280;opacity:1}' +
    '#reviews-panel .rv-send{width:100%;margin-top:10px;min-height:48px;touch-action:manipulation}#reviews-panel .rv-msg{min-height:22px;margin:8px 0 0;font-size:14px;text-align:center}#reviews-panel .rv-msg.err{color:#ff8f8f}html.light #reviews-panel .rv-msg.err{color:#b00020}' +
    '#reviews-panel .rv-card{display:flex;gap:10px;padding:12px 0;border-top:1px solid var(--line,rgba(150,160,220,.25))}#reviews-panel .rv-av{flex:none;width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#7c5cff,#c94dd8);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700}' +
    '#reviews-panel .rv-body{flex:1;min-width:0}#reviews-panel .rv-head{display:flex;gap:8px;align-items:center;flex-wrap:wrap}#reviews-panel .rv-name{font-weight:700}#reviews-panel .rv-date,#reviews-panel .rv-tag{font-size:12px;opacity:.7}' +
    '#reviews-panel .rv-txt{margin:4px 0 6px;white-space:pre-wrap;overflow-wrap:anywhere}#reviews-panel .rv-like{border:1px solid var(--line,rgba(150,160,220,.35));background:transparent;color:inherit;border-radius:999px;padding:6px 12px;min-height:36px;cursor:pointer;font:inherit;font-size:14px;touch-action:manipulation}#reviews-panel .rv-like.on{background:rgba(124,92,255,.25);border-color:rgba(124,92,255,.7)}#reviews-panel .rv-like[disabled]{opacity:.5;cursor:default}' +
    '#reviews-panel .rv-del{margin-inline-start:8px;border:1px solid rgba(255,120,120,.6);background:transparent;color:#ff9a9a;border-radius:999px;padding:6px 12px;min-height:36px;cursor:pointer;font:inherit;font-size:14px}html.light #reviews-panel .rv-del{color:#b00020;border-color:#b00020}#reviews-panel .rv-modbar{margin-top:10px;text-align:center;font-size:13px}#reviews-panel .rv-modbar a{cursor:pointer;text-decoration:underline;opacity:.8}#reviews-panel .rv-modbar form{display:flex;gap:8px;align-items:center;margin-top:6px}#reviews-panel .rv-modbar input{margin-top:0}#reviews-panel .rv-modbar button{min-height:44px;padding:0 14px;cursor:pointer}#dl-chip{display:inline-flex}' +
    '#rate-panel,#social-panel{display:none!important}';
  var LSget = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var LSset = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var uuid = function () { return (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, function () { return (Math.random() * 16 | 0).toString(16); })); };
  var cid = LSget('nova_cid');
  if (!cid || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(cid)) { cid = uuid().toLowerCase(); LSset('nova_cid', cid); }
  var lang = function () { var l = (LSget('nova-lang') || document.documentElement.lang || 'ar').slice(0, 2); return T[l] ? l : (l === 'ar' ? 'ar' : 'en'); };
  var t = function (k) { return T[lang()][k]; };
  var modKey = null; try { modKey = sessionStorage.getItem('nova_mod'); } catch (e) {}
  var modOpen = false, dlTotal = null;
  var data = null, picked = 0, msgKey = '', msgErr = false, busy = false;
  var $ = function (id) { return document.getElementById(id); };
  var stars = function (n) { var s = ''; for (var i = 1; i <= 5; i++) s += '<span class="' + (i <= Math.round(n) ? '' : 'off') + '">★</span>'; return s; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var sec = document.createElement('section'); sec.className = 'panel'; sec.id = 'reviews-panel';
    sec.innerHTML = '<h2><span id="rv-h"></span></h2><div id="rv-sum"></div>' +
      '<form id="rv-form" novalidate><div class="rv-pick" id="rv-pick" role="radiogroup"></div>' +
      '<input id="rv-name" maxlength="40" autocomplete="off" enterkeyhint="next"><textarea id="rv-text" maxlength="500" rows="3" enterkeyhint="enter"></textarea>' +
      '<div class="rv-msg" id="rv-msg" role="status" aria-live="polite"></div>' +
      '<button type="submit" class="quality primary rv-send" id="rv-send"></button></form>' +
      '<div id="rv-list"></div><p class="rate-note" id="rv-priv"></p><div class="rv-modbar" id="rv-modbar"></div>';
    var anchor = $('rate-panel') || document.querySelector('main .panel');
    if (anchor) anchor.after(sec); else document.querySelector('main').appendChild(sec);
    var pick = $('rv-pick');
    for (var i = 1; i <= 5; i++) { var b = document.createElement('button'); b.type = 'button'; b.textContent = '★'; b.dataset.s = i; b.setAttribute('aria-label', i + ' / 5'); pick.appendChild(b); }
    pick.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; picked = +b.dataset.s; msg('', false); paintPick(); });
    var send = $('rv-send');
    send.addEventListener('mousedown', function (e) { e.preventDefault(); });
    $('rv-form').addEventListener('submit', function (e) { e.preventDefault(); submit(); });
    $('rv-name').value = LSget('nova_rv_name') || '';
    $('rv-list').addEventListener('click', function (e) { var d = e.target.closest('.rv-del'); if (d) { delReview(+d.dataset.id, d); return; } var b = e.target.closest('.rv-like'); if (!b || b.disabled) return; like(+b.dataset.id, b); });
    paint();
  }
  function msg(k, err, raw) { msgKey = k; msgErr = !!err; var m = $('rv-msg'); if (!m) return; m.textContent = raw || (k ? t(k) : ''); m.className = 'rv-msg' + (err ? ' err' : ''); }
  function paintPick() { var bs = $('rv-pick').children; for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('on', i < picked); }
  function mine() { return data && data.reviews.filter(function (r) { return r.mine; })[0]; }
  function paint() {
    $('rv-h').textContent = t('h'); $('rv-name').placeholder = t('name'); $('rv-text').placeholder = t('ph'); $('rv-priv').textContent = t('priv');
    $('rv-send').textContent = mine() ? t('upd') : t('send');
    paintMod(); paintDl();
    if (msgKey) msg(msgKey, msgErr);
    var s = data && data.summary, sum = $('rv-sum');
    if (s && s.count) {
      var mx = Math.max.apply(null, s.dist) || 1, bars = '';
      for (var i = 5; i >= 1; i--) bars += '<div class="rv-row"><span>' + i + '</span><div class="rv-bar"><i style="width:' + Math.round(s.dist[i - 1] / mx * 100) + '%"></i></div><span>' + s.dist[i - 1] + '</span></div>';
      sum.innerHTML = '<div class="rv-sum"><div><div class="rv-big">' + Number(s.avg).toFixed(1) + '</div><div class="rv-st">' + stars(s.avg) + '</div><div class="rv-cnt">' + t('cnt').replace('{n}', s.count) + '</div></div><div class="rv-bars">' + bars + '</div></div>';
    } else sum.innerHTML = '<p class="rate-note" style="text-align:center">' + esc(t('none')) + '</p>';
    var list = $('rv-list'); list.innerHTML = '';
    if (data && !data.reviews.length) { var p = document.createElement('p'); p.className = 'rate-note'; p.textContent = t('empty'); list.appendChild(p); }
    (data ? data.reviews : []).forEach(function (r) {
      var c = document.createElement('div'); c.className = 'rv-card';
      var d = new Date(r.ts * 1000), ds = ''; try { ds = d.toLocaleDateString(lang() === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) {}
      c.innerHTML = '<div class="rv-av">' + esc((r.name || '?').trim().charAt(0).toUpperCase()) + '</div><div class="rv-body"><div class="rv-head"><span class="rv-name">' + esc(r.name) + '</span>' + (r.mine ? '<span class="rv-tag">' + esc(t('mine')) + '</span>' : '') + '</div>' +
        '<div class="rv-head"><span class="rv-st">' + stars(r.stars) + '</span><span class="rv-date">' + esc(ds) + (r.edited ? ' · ' + esc(t('edited')) : '') + '</span></div>' +
        (r.text ? '<div class="rv-txt">' + esc(r.text) + '</div>' : '') +
        '<button type="button" class="rv-like' + (r.liked ? ' on' : '') + '" data-id="' + r.id + '"' + (r.mine ? ' disabled title="' + esc(t('own')) + '"' : '') + '>👍 ' + esc(t('helpful')) + ' · <span>' + r.likes + '</span></button>' + (modKey ? '<button type="button" class="rv-del" data-id="' + r.id + '">🗑 ' + esc(t('del')) + '</button>' : '') + '</div>';
      list.appendChild(c);
    });
  }

  function paintMod() {
    var bar = $('rv-modbar'); if (!bar) return; bar.innerHTML = '';
    if (modKey) { var a = document.createElement('a'); a.textContent = t('modoff'); a.onclick = function () { modKey = null; try { sessionStorage.removeItem('nova_mod'); } catch (e) {} msg('', false); paint(); }; bar.appendChild(a); return; }
    if (!modOpen) { var l = document.createElement('a'); l.textContent = t('mod'); l.onclick = function () { modOpen = true; paintMod(); var i = $('rv-modpw'); if (i) i.focus(); }; bar.appendChild(l); return; }
    var f = document.createElement('form'); f.innerHTML = '<input id="rv-modpw" type="password" autocomplete="current-password" placeholder="' + esc(t('modpw')) + '"><button type="submit" class="quality">' + esc(t('modon')) + '</button>';
    f.onsubmit = function (e) { e.preventDefault(); var k = $('rv-modpw').value; if (!k) return; modCheck(k); };
    bar.appendChild(f);
  }
  function modCheck(k) {
    fetch(API + '/api/mod/check', { method: 'POST', headers: { 'x-mod-key': k } }).then(function (r) {
      if (r.status === 503) { msg('modoffl', true); return; } if (r.status === 429) { msg('limit', true); return; } if (!r.ok) { msg('modbad', true); return; }
      modKey = k; try { sessionStorage.setItem('nova_mod', k); } catch (e) {} modOpen = false; msg('', false); paint();
    }).catch(function () { msg('fail', true); });
  }
  function delReview(id, btn) {
    if (!modKey || !window.confirm(t('delq'))) return; btn.disabled = true;
    fetch(API + '/api/reviews/delete', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-mod-key': modKey }, body: JSON.stringify({ id: id }) }).then(function (r) {
      if (r.status === 403) { modKey = null; try { sessionStorage.removeItem('nova_mod'); } catch (e) {} paint(); msg('modbad', true); return; }
      if (!r.ok && r.status !== 404) throw new Error('http'); load();
    }).catch(function () { btn.disabled = false; msg('delfail', true); });
  }
  function paintDl() {
    var chips = document.querySelector('.chips'); if (!chips) return;
    var c = $('dl-chip');
    if (dlTotal === null) { if (c) c.remove(); return; }
    if (!c) { c = document.createElement('span'); c.className = 'chip'; c.id = 'dl-chip'; chips.appendChild(c); }
    c.title = t('dlt'); c.textContent = '⬇ ' + t('dl').replace('{n}', dlTotal);
  }
  function loadDl() { fetch(API + '/api/stats/downloads').then(function (r) { return r.ok ? r.json() : Promise.reject(); }).then(function (d) { dlTotal = d.total; paintDl(); }).catch(function () {}); }
  function countDl(e) {
    var a = e.target.closest && e.target.closest('#variants a.quality'); if (!a) return;
    fetch(API + '/api/dl', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cid: cid }), keepalive: true })
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (d) { if (d && typeof d.total === 'number') { dlTotal = d.total; paintDl(); } }).catch(function () {});
  }
  function load() {
    fetch(API + '/api/reviews?cid=' + cid).then(function (r) { return r.ok ? r.json() : Promise.reject(); }).then(function (d) {
      data = d; var m = mine(); if (m && !picked) { picked = m.stars; $('rv-text').value = $('rv-text').value || m.text; if (!$('rv-name').value) $('rv-name').value = m.name; paintPick(); } paint();
    }).catch(function () { var l = $('rv-list'); l.innerHTML = ''; var p = document.createElement('p'); p.className = 'rate-note'; p.textContent = t('loadfail'); l.appendChild(p); });
  }
  function submit() {
    if (busy) return;
    if (!picked) { msg('pick', true); return; }
    busy = true; $('rv-send').disabled = true; msg('sending', false);
    var name = $('rv-name').value.trim(); LSset('nova_rv_name', name);
    var ctl = ('AbortController' in window) ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
    fetch(API + '/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cid: cid, name: name, stars: picked, text: $('rv-text').value.trim() }), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { if (r.status === 429) { msg('limit', true); return null; } if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (d) { if (!d) return; data = d; $('rv-text').value = ''; picked = 0; paintPick(); paint(); msg('ok', false); })
      .catch(function (e) { if (window.console) console.error('review submit failed', e); msg('fail', true); })
      .then(function () { clearTimeout(to); busy = false; $('rv-send').disabled = false; });
  }
  function like(id, btn) {
    btn.disabled = true;
    fetch(API + '/api/reviews/like', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cid: cid, id: id }) })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) { (data.reviews.filter(function (x) { return x.id === d.id; })[0] || {}).likes = d.likes; (data.reviews.filter(function (x) { return x.id === d.id; })[0] || {}).liked = d.liked; paint(); })
      .catch(function () { btn.disabled = false; msg('fail', true); });
  }
  function init() {
    if (document.getElementById('reviews-panel')) return;
    build(); load(); loadDl();
    document.addEventListener('click', countDl, true); document.addEventListener('auxclick', countDl, true);
    window.novaReviewsPaint = paint;
    new MutationObserver(function () { paint(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
  }
  window.novaReviewsInit = init;
  if (document.getElementById('rate-panel')) init(); else document.addEventListener('DOMContentLoaded', init);
})();
