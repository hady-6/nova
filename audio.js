/* NOVA: local MP3 extraction. Adapted from the supplied static package (ffmpeg.wasm from jsDelivr, pinned). The chosen file never leaves the device. */
(function () {
  var SRC = (document.currentScript && document.currentScript.src) || location.href;
  var T = {
    ar: { go: 'استخراج MP3', loading: 'تحميل أداة التحويل لأول مرة…', working: 'جارٍ استخراج الصوت محليًا…', ready: 'تم تجهيز MP3. اضغط حفظ MP3.', save: 'حفظ MP3', size: 'الملف أكبر من 100MB. اختر ملفًا أصغر.', noaudio: 'الفيديو لا يحتوي على مسار صوت قابل للتحويل.', timeout: 'التحويل استغرق وقتًا طويلًا. جرّب ملفًا أصغر واترك الصفحة مفتوحة.', loaderr: 'تعذّر تحميل أداة التحويل. تأكد من الاتصال وحاول مرة أخرى.', err: 'تعذّر التحويل. اختر MP4 أو WebM أقل من 100MB.' },
    en: { go: 'Extract MP3', loading: 'Loading the converter for the first time…', working: 'Extracting audio on this device…', ready: 'MP3 is ready. Tap Save MP3.', save: 'Save MP3', size: 'The file is over 100MB. Choose a smaller file.', noaudio: 'This video has no convertible audio track.', timeout: 'Conversion took too long. Try a smaller file and keep this page open.', loaderr: 'Could not load the converter. Check your connection and try again.', err: 'Could not convert. Choose an MP4 or WebM under 100MB.' }
  };
  var lang = function () { var l = ''; try { l = localStorage.getItem('nova-lang') || ''; } catch (e) {} l = (l || document.documentElement.lang || 'ar').slice(0, 2); return l === 'ar' ? 'ar' : 'en'; };
  var t = function (k) { return T[lang()][k]; };
  var $ = function (id) { return document.getElementById(id); };
  var status = '', ff = null, mode = 'link', outputURL = null;
  function css() {
    var s = document.createElement('style');
    s.textContent = '#nova-modes{display:flex;gap:6px;margin:0 0 16px;padding:4px;border:1px solid rgba(128,128,160,.25);border-radius:16px}#nova-modes button{flex:1;min-height:42px;border:0;border-radius:12px;background:transparent;color:inherit;font:inherit;cursor:pointer;opacity:.7}#nova-modes button[aria-pressed=true]{background:linear-gradient(110deg,#428fff,#9251ef);color:#fff;opacity:1}#go-panel [hidden]{display:none!important}#audio-save{display:block;text-align:center;margin:12px 0 0}#audio-tools{margin:0}#audio-tools .file-pick{position:relative;display:flex;align-items:center;gap:10px;min-height:58px;padding:10px 14px;margin:0 0 12px;border:1px solid rgba(128,128,160,.25);border-radius:18px;background:rgba(80,80,120,.06);cursor:pointer;box-sizing:border-box}#audio-file{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}#audio-tools .file-pick:focus-within{outline:2px solid #649cff;outline-offset:2px}#audio-file-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;opacity:.75;font-size:13px}#audio-extract{width:100%}#audio-progress{width:100%;height:6px;margin:12px 0 0;display:block}#audio-status:empty{display:none}#audio-status{margin:10px 0 0;font-size:13px}';
    document.head.appendChild(s);
  }
  function setMode(next) {
    if (ffBusy) return;
    mode = next;
    var gp = $('go-panel');
    gp.querySelector('label[for=url]').hidden = mode !== 'link';
    gp.querySelector('.urlrow').hidden = mode !== 'link';
    $('go').hidden = mode !== 'link'; $('msg').hidden = mode !== 'link';
    $('audio-tools').hidden = mode !== 'file';
    $('audio-extract').hidden = mode !== 'file';
    $('audio-feedback').hidden = mode !== 'file';
    $('nova-mode-link').setAttribute('aria-pressed', String(mode === 'link'));
    $('nova-mode-file').setAttribute('aria-pressed', String(mode === 'file'));
  }
  var ffBusy = false;
  function paint() {
    if (!$('audio-tools')) return;
    var ar = lang() === 'ar';
    $('nova-mode-link').textContent = ar ? 'رابط فيديو' : 'Video link';
    $('nova-mode-file').textContent = ar ? 'ملف إلى MP3' : 'File to MP3';
    $('audio-choose').textContent = ar ? 'اختيار فيديو' : 'Choose video';
    $('audio-file').setAttribute('aria-label', ar ? 'اختيار فيديو من جهازك، حتى 100MB' : 'Choose a video on your device, up to 100MB');
    $('audio-tools').title = ar ? 'ملف من جهازك · حتى 100MB' : 'File on your device · up to 100MB';
    $('audio-extract').textContent = t('go');
    $('audio-save').textContent = t('save');
    var f = $('audio-file').files && $('audio-file').files[0];
    $('audio-file-name').textContent = f ? f.name : (ar ? 'من جهازك' : 'From your device');
    $('audio-status').textContent = status ? t(status) : '';
  }
  function build() {
    if ($('audio-tools')) return;
    var gp = $('go-panel'); if (!gp) return;
    var modes = document.createElement('div'); modes.id = 'nova-modes';
    modes.innerHTML = '<button type="button" id="nova-mode-link" aria-pressed="true"></button><button type="button" id="nova-mode-file" aria-pressed="false"></button>';
    gp.insertBefore(modes, gp.firstChild);
    var sec = document.createElement('div'); sec.id = 'audio-tools'; sec.hidden = true;
    sec.innerHTML = '<label class="file-pick"><span id="audio-choose"></span><span id="audio-file-name" dir="auto"></span><input id="audio-file" type="file" accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.mkv,.m4v"></label>';
    gp.insertBefore(sec, $('go'));
    var btn = document.createElement('button'); btn.id = 'audio-extract'; btn.className = 'primary big'; btn.type = 'button'; btn.disabled = true; btn.hidden = true;
    $('go').after(btn);
    var feedback = document.createElement('div'); feedback.id = 'audio-feedback'; feedback.hidden = true;
    feedback.innerHTML = '<a id="audio-save" class="quality primary" hidden></a><progress id="audio-progress" max="100" value="0" hidden></progress><p id="audio-status" role="status" aria-live="polite"></p>';
    btn.after(feedback);
    css(); paint(); setMode('link');
    $('nova-mode-link').addEventListener('click', function () { setMode('link'); });
    $('nova-mode-file').addEventListener('click', function () { setMode('file'); });
    $('audio-file').addEventListener('change', function () {
      var f = this.files && this.files[0]; $('audio-extract').disabled = !f;
      clearOutput(); status = ''; $('audio-progress').hidden = true; paint();
    });
    btn.addEventListener('click', run);
    new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
  }
  function clearOutput() {
    if (outputURL) URL.revokeObjectURL(outputURL);
    outputURL = null;
    var a = $('audio-save'); if (a) { a.hidden = true; a.removeAttribute('href'); }
  }
  function loadScript(u, globalName) {
    if (window[globalName]) return Promise.resolve();
    return new Promise(function (ok, no) {
      var e = document.createElement('script'); e.src = u;
      e.onload = ok; e.onerror = function () { e.remove(); no(new Error('loaderr')); };
      document.head.appendChild(e);
    });
  }
  async function run() {
    if (ffBusy) return;
    var f = $('audio-file').files && $('audio-file').files[0]; if (!f) return;
    clearOutput();
    var btn = $('audio-extract'), pr = $('audio-progress');
    if (f.size > 100 * 1024 * 1024) { status = 'size'; paint(); return; }
    ffBusy = true; $('audio-file').disabled = true; $('nova-mode-link').disabled = true; $('nova-mode-file').disabled = true; btn.disabled = true; pr.hidden = false; pr.value = 0; status = 'loading'; paint();
    var timer, coreURL, wasmURL, logs = '', inst;
    try {
      var work = (async function () {
        var CDN = 'https://cdn.jsdelivr.net/npm/@ffmpeg/';
        await Promise.all([loadScript(new URL('ff/ffmpeg.js', SRC).href, 'FFmpegWASM'), loadScript(CDN + 'util@0.12.1/dist/umd/index.js', 'FFmpegUtil')]);
        var U = window.FFmpegUtil, base = CDN + 'core@0.12.10/dist/umd';
        inst = new window.FFmpegWASM.FFmpeg(); ff = inst;
        inst.on('log', function (e) { logs = (logs + '\n' + e.message).slice(-6000); });
        inst.on('progress', function (e) { pr.value = Math.max(0, Math.min(99, Math.round(e.progress * 100))); });
        coreURL = await U.toBlobURL(base + '/ffmpeg-core.js', 'text/javascript');
        wasmURL = await U.toBlobURL(base + '/ffmpeg-core.wasm', 'application/wasm');
        await inst.load({ coreURL: coreURL, wasmURL: wasmURL });
        status = 'working'; paint();
        var ext = ((f.name.match(/\.[a-z0-9]{2,5}$/i) || ['.mp4'])[0]).toLowerCase(), inp = 'input' + ext;
        await inst.writeFile(inp, new Uint8Array(await f.arrayBuffer()));
        var rc = await inst.exec(['-i', inp, '-map', '0:a:0', '-vn', '-c:a', 'libmp3lame', '-q:a', '4', 'nova-audio.mp3']);
        if (rc !== 0) throw new Error(/matches no streams|does not contain any stream|no audio/i.test(logs) ? 'noaudio' : 'err');
        return await inst.readFile('nova-audio.mp3');
      })();
      var data = await Promise.race([work, new Promise(function (_, no) { timer = setTimeout(function () { no(new Error('timeout')); }, 180000); })]);
      if (!data || !data.length) throw new Error('noaudio');
      outputURL = URL.createObjectURL(new Blob([data], { type: 'audio/mpeg' }));
      var a = $('audio-save'); a.href = outputURL; a.download = (f.name.replace(/\.[^.]+$/, '') || 'nova-audio') + '.mp3'; a.hidden = false;
      a.onclick = function () {
        try { var c = localStorage.getItem('nova_cid') || ''; fetch('https://nova-api.alaziziya7.workers.dev/api/dl', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cid: c }), keepalive: true }).then(function () { if (window.novaDlRefresh) window.novaDlRefresh(); }).catch(function () {}); } catch (e) {}
      };
      pr.value = 100; status = 'ready';
    } catch (e) {
      console.error('audio extract failed', e);
      status = ['noaudio', 'timeout', 'loaderr'].indexOf(e.message) >= 0 ? e.message : (status === 'loading' ? 'loaderr' : 'err');
    } finally {
      clearTimeout(timer);
      if (inst) { try { inst.terminate(); } catch (e) {} } ff = null;
      if (coreURL) URL.revokeObjectURL(coreURL); if (wasmURL) URL.revokeObjectURL(wasmURL);
      ffBusy = false; $('audio-file').disabled = false; $('nova-mode-link').disabled = false; $('nova-mode-file').disabled = false; btn.disabled = false; paint();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(build, 0); }); else setTimeout(build, 0);
})();
