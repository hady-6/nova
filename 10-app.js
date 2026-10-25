/* N O V A — حمّل فيديو من بنترست ولينكات مباشرة — كل المنطق بيشتغل على جهاز المستخدم */
'use strict';

const I18N = {
  ar: {
    _dir: 'rtl', _lang_btn: 'English',
    pill_badge: 'مفتوح المصدر', pill_text: 'نسخة 2026 · مجاني بالكامل',
    h1: 'حمّل فيديوهاتك بسهولة',
    sub: 'من بنترست ولينكات الفيديو المباشرة، بكل الجودات الأصلية المتاحة فعلًا. مجانًا، من غير حساب، وكل حاجة بتتم على جهازك.',
    url_label: 'لينك الفيديو', ph: 'https://www.pinterest.com/pin/…', paste_title: 'لصق',
    go: 'هات الفيديو', going: 'بجيب الفيديو…',
    chip_free: 'مجاني', chip_nolimits: 'بلا حساب', chip_fast: 'سريع', chip_private: 'خاص', chip_oss: 'مفتوح المصدر',
    choose_quality: 'اختار الجودة',
    howto_save_t: 'إزاي تحفظه',
    howto_save_b: 'دوس على الجودة، الفيديو هيفتح لوحده في صفحة جديدة. شغّله، ومن ⋮ اختار «تنزيل» وهيتحفظ على موبايلك. بنترست مانعة التحميل بضغطة واحدة من أي موقع خارجي.',
    ready_t: 'جاهز يتحمّل', dl_btn: 'تحميل الفيديو',
    fallback_t: 'التحميل المباشر متعذر',
    fallback_b: 'الموقع اللي عليه الفيديو مانع التحميل من هنا. افتحه من اللينك ده واحفظه من ⋮ ثم «تنزيل»:',
    fallback_open: 'فتح الفيديو',
    ok_t: 'اتحمّل ✓', ok_b: 'الفيديو نزل على جهازك.',
    about_h: 'نوفا - أداة مجانية ومفتوحة المصدر لتنزيل الفيديو',
    about_p1: 'نوفا أداة بسيطة بتشتغل من المتصفح مباشرة: الصق لينك بين من بنترست أو لينك فيديو مباشر، وهيظهرلك كل الجودات المتاحة فعلًا في المصدر، تختار وتحمّل.',
    about_p2: 'مفيش حسابات، مفيش إعلانات، ومفيش حاجة بتتخزن عندنا: الصفحة بتتكلم مع الموقع اللي جاي منه الفيديو وبس، والتحميل بيحصل على جهازك.',
    how_h: 'إزاي تحمّل؟',
    step1_t: 'انسخ لينك الفيديو', step1_b: 'روح بنترست، افتح البين اللي فيه الفيديو، وانسخ اللينك الكامل من شريط العنوان.',
    step2_t: 'الصقه واختار الجودة', step2_b: 'الصق اللينك فوق ودوس «هات الفيديو». نوفا هيعرض كل الجودات الموجودة فعلًا في الفيديو الأصلي.',
    step3_t: 'حمّل على جهازك', step3_b: 'دوس على الجودة اللي عايزها، الفيديو هيفتح في صفحة جديدة، ومن ⋮ اختار «تنزيل».',
    fmt_h: 'الصيغ والجودات',
    fmt_b1: 'من بنترست: كل جودات الـMP4 الأصلية المتاحة في الفيديو نفسه، من غير تحسين ولا تكبير. ومن اللينكات المباشرة: الفيديو بيتحفظ بصيغته الأصلية زي ما هي (mp4 أو webm أو mov).',
    fmt_b2: 'تحويل الصيغ (زي استخراج MP3 صوت بس) مش متاح حاليًا: ده محتاج تحويل حقيقي للملف على سيرفر، ونوفا دلوقتي بيشتغل كله على جهازك من غير سيرفر.',
    feat_h: 'ليه نوفا؟',
    feat1_t: 'جودات حقيقية', feat1_b: 'الجودات المعروضة هي الموجودة فعلًا في المصدر، مفيش أرقام وهمية ولا تكبير.',
    feat2_t: 'خصوصية', feat2_b: 'اللينك بيروح لبنترست بس (أو للموقع اللي عليه الفيديو) عشان يجيب الجودات. مفيش حسابات ولا تخزين عندنا.',
    feat3_t: 'مفتوح المصدر', feat3_b: 'الكود بينتشر على جيت هاب برخصة MIT: تقرأه وتعدّله وتستخدمه بحرية.',
    feat4_t: 'مجاني بلا إعلانات', feat4_b: 'مفيش إعلانات منبثقة ولا حسابات ولا خطوات زيادة.',
    plat_h: 'المنصات المدعومة',
    plat_pin: 'بنترست', plat_pin_b: 'فيديوهات البين العامة بكل جوداتها الأصلية.',
    plat_direct: 'لينكات مباشرة', plat_direct_b: 'أي لينك فيديو مباشر ينتهي بـ mp4 أو webm أو mov.',
    plat_no: 'مش مدعومين حاليًا: يوتيوب، فيسبوك، انستجرام، تويتر/إكس. المواقع دي قافلة التحميل من غير سيرفر خاص.',
    faq_h: 'الأسئلة الشائعة',
    faq1_q: 'ليه لينك pin.it المختصر مش بيشتغل؟',
    faq1_a: 'لينكات pin.it لازم تتفتح الأول: افتح اللينك في المتصفح، هيتحوّل للينك طويل، انسخه من شريط العنوان والصقه هنا.',
    faq2_q: 'ليه الفيديو بيفتح في المشغل بدل ما ينزل على طول؟',
    faq2_a: 'بنترست مانعة التحميل بضغطة واحدة من المواقع الخارجية. دوس على الجودة، شغّل الفيديو في الصفحة الجديدة، ومن ⋮ اختار «تنزيل».',
    faq3_q: 'أقدر أحمّل MP3 أو صيغ تانية؟',
    faq3_a: 'حاليًا الفيديو بيتحفظ بصيغته الأصلية (MP4 من بنترست). استخراج الصوت MP3 أو التحويل لصيغ تانية محتاج سيرفر تحويل، ومش متاح في نوفا دلوقتي.',
    faq4_q: 'بيحمّل من يوتيوب أو فيسبوك أو انستجرام؟',
    faq4_a: 'لأ حاليًا. المنصات دي قافلة التحميل المباشر من المتصفح، ودعمها محتاج سيرفر خاص. نوفا دلوقتي شغال مع بنترست واللينكات المباشرة.',
    faq5_q: 'التحميل قانوني؟',
    faq5_a: 'حمّل بس المحتوى اللي تملكه أو المسموح لك تحفظه، والتزم بالقوانين المحلية وشروط كل منصة. حقوق المحتوى لأصحابها.',
    footer1: 'الجودات المعروضة هي الموجودة فعلًا في المصدر، مفيش تحسين أو تكبير.',
    footer2: 'حمّل بس المحتوى اللي تملكه أو المسموح لك تحفظه، واحترم حقوق أصحاب المحتوى.',
    footer3: 'مفتوح المصدر برخصة MIT',
    rate_h: 'قيّم نوفا', rate_note: 'اختار عدد النجوم - تقييمك بيتحفظ على جهازك بس، مش بيتبعت لأي حد.', rate_saved: 'شكرًا! تقييمك اتحفظ على جهازك ✦', rate_pub: 'عايز تقييمك يبان للناس؟ اديلنا نجمة على جيت هاب:', rate_gh: 'نجمة على جيت هاب',
    pin_default: 'فيديو بنترست',
    err_short_t: 'اللينك المختصر ده', err_short_b: 'لينكات pin.it محتاجة تتفتح الأول: افتح اللينك في المتصفح، هيتحوّل للينك طويل، انسخه من شريط العنوان والصقه هنا.',
    err_bad_t: 'اللينك مش واضح', err_bad_b: 'الصق لينك بين من بنترست (زي pinterest.com/pin/…) أو لينك فيديو مباشر ينتهي بـ mp4.',
    err_notfound_t: 'مش لاقي البين ده', err_notfound_b: 'اتأكد إن اللينك صح وإن البين عام مش سري.',
    err_novideo_t: 'ده مش فيديو', err_novideo_b: 'البين ده صورة مش فيديو، فمفيش حاجة تتحمّل منه كفيديو.',
    err_network_t: 'مشكلة في الاتصال', err_network_b: 'النت قطع أو بنترست ماردش. جرّب تاني.',
  },
  en: {
    _dir: 'ltr', _lang_btn: 'عربي',
    pill_badge: 'Open source', pill_text: '2026 edition · completely free',
    h1: 'Download videos with ease',
    sub: 'From Pinterest and direct video links, in all original qualities actually available. Free, no account, everything runs on your device.',
    url_label: 'Video link', ph: 'https://www.pinterest.com/pin/…', paste_title: 'Paste',
    go: 'Get video', going: 'Fetching…',
    chip_free: 'Free', chip_nolimits: 'No account', chip_fast: 'Fast', chip_private: 'Private', chip_oss: 'Open source',
    choose_quality: 'Choose quality',
    howto_save_t: 'How to save it',
    howto_save_b: 'Tap a quality and the video opens alone in a new tab. Play it, then choose "Download" from the ⋮ menu to save it. Pinterest blocks one-tap downloads from external sites.',
    ready_t: 'Ready to download', dl_btn: 'Download video',
    fallback_t: 'Direct download blocked',
    fallback_b: 'The site hosting this video blocks downloads from here. Open it from this link and save it via ⋮ then "Download":',
    fallback_open: 'Open video',
    ok_t: 'Downloaded ✓', ok_b: 'The video is on your device.',
    about_h: 'NOVA - a free, open-source video downloader',
    about_p1: 'NOVA is a simple tool that runs entirely in your browser: paste a Pinterest pin link or a direct video link, see every quality actually available at the source, pick one, and download.',
    about_p2: 'No accounts, no ads, nothing stored on our side: the page only talks to the site the video comes from, and the download happens on your device.',
    how_h: 'How to download',
    step1_t: 'Copy the video link', step1_b: 'Open Pinterest, find the pin with the video, and copy its full link from the address bar.',
    step2_t: 'Paste it and pick a quality', step2_b: 'Paste the link above and hit "Get video". NOVA lists every quality that actually exists in the original video.',
    step3_t: 'Save it to your device', step3_b: 'Tap the quality you want - the video opens in a new tab, then choose "Download" from the ⋮ menu.',
    fmt_h: 'Formats & quality',
    fmt_b1: 'From Pinterest: every original MP4 quality available in the video itself, no fake enhancement or upscaling. From direct links: the video is saved in its original format as-is (mp4, webm, or mov).',
    fmt_b2: 'Format conversion (like extracting MP3 audio) is not available yet: it needs real server-side transcoding, and NOVA currently runs entirely on your device with no server.',
    feat_h: 'Why NOVA?',
    feat1_t: 'Real qualities', feat1_b: 'The listed qualities are the ones actually present at the source - no fake numbers, no upscaling.',
    feat2_t: 'Privacy', feat2_b: 'Your link goes only to Pinterest (or the site hosting the video) to fetch the qualities. No accounts, nothing stored by us.',
    feat3_t: 'Open source', feat3_b: 'The code is being published on GitHub under the MIT license - read it, modify it, use it freely.',
    feat4_t: 'Free, no ads', feat4_b: 'No popups, no accounts, no extra steps.',
    plat_h: 'Supported platforms',
    plat_pin: 'Pinterest', plat_pin_b: 'Public pin videos in all their original qualities.',
    plat_direct: 'Direct links', plat_direct_b: 'Any direct video link ending in mp4, webm, or mov.',
    plat_no: 'Not supported yet: YouTube, Facebook, Instagram, X/Twitter - those sites block downloads without a dedicated server.',
    faq_h: 'FAQ',
    faq1_q: "Why doesn't the short pin.it link work?",
    faq1_a: 'pin.it links need to be opened first: open the link in your browser, it turns into the long link - copy that from the address bar and paste it here.',
    faq2_q: 'Why does the video open in a player instead of downloading?',
    faq2_a: 'Pinterest blocks one-tap downloads from external sites. Tap a quality, play the video in the new tab, and choose "Download" from the ⋮ menu.',
    faq3_q: 'Can I download MP3 or other formats?',
    faq3_a: 'Right now the video is saved in its original format (MP4 from Pinterest). Extracting MP3 audio or converting formats needs a conversion server and is not available in NOVA yet.',
    faq4_q: 'Does it download from YouTube, Facebook, or Instagram?',
    faq4_a: 'Not yet. Those platforms block direct browser downloads and need a dedicated server. NOVA currently works with Pinterest and direct links.',
    faq5_q: 'Is downloading legal?',
    faq5_a: 'Only download content you own or have permission to save, and follow local laws and each platform\'s terms. Content rights belong to their owners.',
    footer1: 'Listed qualities are the ones actually present at the source - no enhancement or upscaling.',
    footer2: 'Only download content you own or have permission to save, and respect content owners\' rights.',
    footer3: 'Open source under the MIT license',
    rate_h: 'Rate NOVA', rate_note: 'Pick a number of stars - your rating stays on your device only, never sent anywhere.', rate_saved: 'Thanks! Your rating is saved on your device ✦', rate_pub: 'Want your rating to be public? Give us a star on GitHub:', rate_gh: 'Star on GitHub',
    pin_default: 'Pinterest video',
    err_short_t: 'That short link', err_short_b: 'pin.it links need to be opened first: open the link in your browser, it turns into the long link - copy it from the address bar and paste it here.',
    err_bad_t: 'Unclear link', err_bad_b: 'Paste a Pinterest pin link (like pinterest.com/pin/…) or a direct video link ending in mp4.',
    err_notfound_t: 'Pin not found', err_notfound_b: 'Check the link is correct and the pin is public, not secret.',
    err_novideo_t: "That's not a video", err_novideo_b: 'This pin is an image, not a video - there is nothing to download as video.',
    err_network_t: 'Connection problem', err_network_b: 'The network dropped or Pinterest did not respond. Try again.',
  },
};

let lang = localStorage.getItem('nova-lang') || 'ar';
const $ = (id) => document.getElementById(id);
const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.ar[k] || k;

function applyLang() {
  const d = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = d._dir;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); el.setAttribute('aria-label', el.title); });
  $('lang-toggle').textContent = d._lang_btn;
  if (localStorage.getItem('nova-rating')) $('rate-note').textContent = t('rate_saved');
  document.title = lang === 'ar' ? 'N O V A — حمّل فيديوهاتك بسهولة' : 'N O V A — Download videos with ease';
}

$('lang-toggle').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('nova-lang', lang);
  applyLang();
});

const msg = $('msg');

function extractPinId(input) {
  const s = input.trim();
  const m = s.match(/pinterest\.[a-z.]+\/pin\/(\d+)/i) || s.match(/pin\/(\d{6,})/i);
  if (m) return m[1];
  if (/^\d{6,}$/.test(s)) return s;
  return null;
}

function isDirectVideo(input) {
  try {
    const u = new URL(input.trim());
    return /^https?:$/.test(u.protocol) &&
      (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(u.pathname) || u.hostname.endsWith('pinimg.com'));
  } catch { return false; }
}

function decodeEntities(s) {
  const x = document.createElement('textarea');
  x.innerHTML = s;
  return x.value;
}

function showError(kind) {
  msg.innerHTML = '';
  const d = document.createElement('div');
  d.className = 'note error';
  const st = document.createElement('strong');
  st.textContent = t('err_' + kind + '_t');
  const sp = document.createElement('span');
  sp.textContent = ' ' + t('err_' + kind + '_b');
  d.appendChild(st);
  d.appendChild(sp);
  msg.appendChild(d);
}

function reset() {
  msg.innerHTML = '';
  $('pin-result').hidden = true;
  $('direct-result').hidden = true;
  $('direct-fallback').hidden = true;
  $('direct-ok').hidden = true;
}

async function fetchPin(id) {
  const r = await fetch('https://widgets.pinterest.com/v3/pidgets/pins/info/?pin_ids=' + encodeURIComponent(id));
  if (!r.ok) throw new Error('network');
  const j = await r.json();
  const pin = j && j.data && j.data[0];
  if (!pin) throw new Error('notfound');
  const list = pin.videos && pin.videos.video_list;
  if (!list) throw new Error('novideo');
  const variants = Object.entries(list)
    .filter(([, v]) => v && typeof v.url === 'string' && v.url.endsWith('.mp4'))
    .map(([key, v]) => ({
      key,
      label: key.replace(/^V_/, '').toLowerCase(),
      url: v.url,
      width: v.width || 0,
      height: v.height || 0,
    }))
    .sort((a, b) => b.width - a.width);
  if (!variants.length) throw new Error('novideo');
  const title = decodeEntities(String((pin.rich_metadata && pin.rich_metadata.title) || pin.description || t('pin_default'))).slice(0, 120);
  return { id, title, variants };
}

async function go() {
  reset();
  let s = $('url').value.trim();
  if (!s && navigator.clipboard && navigator.clipboard.readText) {
    try {
      const c = (await navigator.clipboard.readText()).trim();
      if (c) { s = c; $('url').value = c; }
    } catch { /* إذن الحافظة مرفوض أو غير مدعوم - نكمّل بالسلوك العادي */ }
  }
  if (!s) return showError('bad');
  if (/pin\.it\//i.test(s)) return showError('short');
  if (isDirectVideo(s)) {
    $('direct-result').hidden = false;
    $('direct-result').dataset.url = s;
    return;
  }
  const id = extractPinId(s);
  if (!id) return showError('bad');
  const btn = $('go');
  btn.disabled = true;
  btn.querySelector('span').textContent = t('going');
  try {
    const pin = await fetchPin(id);
    $('pin-title').textContent = pin.title;
    const box = $('variants');
    box.innerHTML = '';
    pin.variants.forEach((v, i) => {
      const a = document.createElement('a');
      a.className = 'quality' + (i === 0 ? ' primary' : '');
      a.href = v.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = `${v.label} · ${v.width}×${v.height} · MP4`;
      box.appendChild(a);
    });
    $('pin-result').hidden = false;
  } catch (e) {
    showError(['notfound', 'novideo', 'network'].includes(e.message) ? e.message : 'network');
  } finally {
    btn.disabled = false;
    btn.querySelector('span').textContent = t('go');
  }
}

async function saveDirect(url, name) {
  $('direct-fallback').hidden = true;
  $('direct-ok').hidden = true;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error('x');
    const b = await r.blob();
    const o = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = o;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(o), 5000);
    $('direct-ok').hidden = false;
  } catch {
    $('direct-open').href = url;
    $('direct-fallback').hidden = false;
  }
}

$('go').addEventListener('click', go);
$('url').addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
$('dl-direct').addEventListener('click', () => saveDirect($('direct-result').dataset.url, 'video.mp4'));
$('paste').addEventListener('click', async () => {
  try {
    const s = await navigator.clipboard.readText();
    if (s) { $('url').value = s.trim(); $('url').focus(); }
  } catch { /* إذن الحافظة مرفوض - المستخدم يلصق يدويًا */ }
});

applyLang();

/* تقييم محلي على الجهاز فقط */
function paintStars(n) {
  document.querySelectorAll('#rate-stars button').forEach((b) => {
    b.classList.toggle('on', Number(b.dataset.star) <= n);
  });
}
$('rate-stars').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  localStorage.setItem('nova-rating', b.dataset.star);
  paintStars(Number(b.dataset.star));
  $('rate-note').textContent = t('rate_saved');
});
paintStars(Number(localStorage.getItem('nova-rating')) || 0);
