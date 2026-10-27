/* NOVA: local MP3 extraction. Adapted from the supplied static package (ffmpeg.wasm from jsDelivr, pinned). The chosen file never leaves the device. */
(function () {
  var SRC = (document.currentScript && document.currentScript.src) || location.href;
  var T = {
    ar: { h: 'استخرج الصوت من ملف فيديو', b: 'اختر فيديو موجودًا على جهازك لتحويل الصوت إلى MP3.', choose: 'اختيار ملف فيديو', go: 'استخراج MP3', loading: 'تحميل أداة التحويل لأول مرة…', working: 'جارٍ استخراج الصوت محليًا…', ready: 'تم تجهيز MP3 للتنزيل.', err: 'تعذّر تحويل الملف. جرّب MP4 أو WebM أصغر.', note: 'الملف يبقى على جهازك ولا يُرفع إلى نوفا. أداة التحويل تُحمّل من jsDelivr عند أول استخدام؛ اختر ملفًا أقل من 100MB.' },
    en: { h: 'Extract audio from a video', b: 'Choose a video already on your device to convert its audio track to MP3.', choose: 'Choose a video file', go: 'Extract MP3', loading: 'Loading the converter for the first time…', working: 'Extracting audio on this device…', ready: 'MP3 is ready to download.', err: 'Could not convert this file. Try a smaller MP4 or WebM.', note: 'Your file stays on your device and is not uploaded to NOVA. The converter loads from jsDelivr on first use; choose a file under 100MB.' }
  };
  var lang = function () { var l = ''; try { l = localStorage.getItem('nova-lang') || ''; } catch (e) {} l = (l || document.documentElement.lang || 'ar').slice(0, 2); return l === 'ar' ? 'ar' : 'en'; };
  var t = function (k) { return T[lang()][k]; };
  var $ = function (id) { return document.getElementById(id); };
  var status = 'note', ff = null;
  function css() {
    var s = document.createElement('style');
    s.textContent = '#audio-tools input[type=file]{width:100%;box-sizing:border-box;font-size:16px;margin:8px 0;direction:ltr}#audio-tools progress{display:block;width:100%;height:10px;margin:10px 0}#audio-tools #audio-extract{min-height:48px;padding:0 18px;cursor:pointer}#audio-tools .audio-status{min-height:1.7em;margin:8px 0 0;font-size:13px}';
    document.head.appendChild(s);
  }
  function paint() {
    var p = $('audio-tools'); if (!p) return;
    p.querySelector('h2').textContent = t('h'); p.querySelector('p.ab').textContent = t('b');
    p.querySelector('label').textContent = t('choose'); $('audio-extract').textContent = t('go');
    if (status) $('audio-status').textContent = t(status);
  }
  function build() {
    if ($('audio-tools')) return;
    var sec = document.createElement('section'); sec.className = 'panel'; sec.id = 'audio-tools';
    sec.innerHTML = '<h2></h2><p class="ab"></p><label for="audio-file"></label><input id="audio-file" type="file" accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.mkv,.m4v"><button id="audio-extract" class="quality" type="button" disabled></button><progress id="audio-progress" max="100" value="0" hidden></progress><p id="audio-status" class="audio-status" role="status" aria-live="polite"></p>';
    var rv = $('reviews-panel'); if (rv && rv.parentNode) rv.parentNode.insertBefore(sec, rv); else document.body.appendChild(sec);
    css(); paint();
    $('audio-file').addEventListener('change', function () {
      var f = this.files && this.files[0]; $('audio-extract').disabled = !f;
      if (f) { status = ''; $('audio-status').textContent = f.name + ' · ' + (f.size / 1048576).toFixed(1) + ' MB'; } else { status = 'note'; paint(); }
    });
    $('audio-extract').addEventListener('click', run);
    new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
  }
  async function run() {
    var f = $('audio-file').files && $('audio-file').files[0]; if (!f) return;
    var btn = $('audio-extract'), pr = $('audio-progress');
    if (f.size > 100 * 1024 * 1024) { status = 'err'; paint(); return; }
    btn.disabled = true; pr.hidden = false; pr.value = 0; status = 'loading'; paint();
    try {
      if (!ff) {
        var CDN = 'https://cdn.jsdelivr.net/npm/@ffmpeg/';
        function loadScript(u) { return new Promise(function (ok, no) { var e = document.createElement('script'); e.src = u; e.onload = ok; e.onerror = no; document.head.appendChild(e); }); }
        await Promise.all([loadScript(new URL('ff/ffmpeg.js', SRC).href), loadScript(CDN + 'util@0.12.1/dist/umd/index.js')]);
        var U = window.FFmpegUtil, base = CDN + 'core@0.12.10/dist/umd';
        var inst = new window.FFmpegWASM.FFmpeg();
        await inst.load({ coreURL: await U.toBlobURL(base + '/ffmpeg-core.js', 'text/javascript'), wasmURL: await U.toBlobURL(base + '/ffmpeg-core.wasm', 'application/wasm') });
        inst.on('progress', function (e) { pr.value = Math.max(0, Math.min(100, Math.round(e.progress * 100))); });
        ff = inst;
      }
      status = 'working'; paint();
      var ext = ((f.name.match(/\.[a-z0-9]{2,5}$/i) || ['.mp4'])[0]).toLowerCase(), inp = 'input' + ext;
      await ff.writeFile(inp, new Uint8Array(await f.arrayBuffer()));
      var rc = await ff.exec(['-i', inp, '-vn', '-c:a', 'libmp3lame', '-q:a', '4', 'nova-audio.mp3']);
      if (rc !== 0) throw new Error('ffmpeg');
      var data = await ff.readFile('nova-audio.mp3');
      var url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' }));
      var a = document.createElement('a'); a.href = url; a.download = (f.name.replace(/\.[^.]+$/, '') || 'nova-audio') + '.mp3';
      document.body.appendChild(a); a.click(); a.remove(); try { var c = localStorage.getItem('nova_cid') || ''; fetch('https://nova-api.alaziziya7.workers.dev/api/dl', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cid: c }), keepalive: true }).then(function () { if (window.novaDlRefresh) window.novaDlRefresh(); }).catch(function () {}); } catch (e) {} setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
      try { await ff.deleteFile(inp); await ff.deleteFile('nova-audio.mp3'); } catch (e) {}
      pr.value = 100; status = 'ready';
    } catch (e) { console.error('audio extract failed', e); status = 'err'; }
    btn.disabled = false; paint();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(build, 0); }); else setTimeout(build, 0);
})();
