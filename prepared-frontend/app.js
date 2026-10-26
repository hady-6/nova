/* N O V A — حمّل فيديو من بنترست ولينكات مباشرة — كل المنطق بيشتغل على جهاز المستخدم */
'use strict';

/* اختياري: لما يتنشر الـ backend العام، اكتب رابطه هنا (مثال 'https://nova.onrender.com').
   فاضي = الصفحة تشتغل زي ما هي بالظبط من غير أي نداءات خارجية. */
const NOVA_BACKEND = '';
/* true فقط لما يتفعّل مسار التنزيل المباشر في السيرفر (NOVA_PUBLIC_PROXY=1) - غير كده الرابط بيفتح الفيديو في صفحة جديدة زي الأول. */
const NOVA_PROXY = false;

/* تخزين آمن: لو المتصفح رافض localStorage (وضع خاص/قيود) الموقع يفضل شغال */
const LS = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
};

async function backendExtract(url) {
  const r = await fetch(NOVA_BACKEND + '/api/extract?url=' + encodeURIComponent(url));
  if (!r.ok) throw new Error('backend');
  const d = await r.json();
  const media = (d.media || []).filter((m) => m && m.kind === 'video' && typeof m.url === 'string');
  if (!media.length) throw new Error('novideo');
  return {
    title: String(d.title || t('pin_default')).slice(0, 120),
    variants: media.map((m) => ({
      label: 'MP4',
      size: m.size || 0,
      url: m.url,
      width: m.width || 0,
      height: m.height || 0,
      ext: m.ext || 'mp4',
    })),
  };
}

function renderResult(res) {
  $('pin-title').textContent = res.title;
  const box = $('variants');
  box.innerHTML = '';
  res.variants.forEach((v, i) => {
    const a = document.createElement('a');
    a.className = 'quality' + (i === 0 ? ' primary' : '');
    a.href = (NOVA_BACKEND && NOVA_PROXY) ? NOVA_BACKEND + '/api/download?name=nova&url=' + encodeURIComponent(v.url) : v.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = (!v.width && v.size) ? `${v.label} · ${(v.size / 1048576).toFixed(1)} MB` : v.width ? `${v.label} · ${v.width}×${v.height} · ${(v.ext || 'mp4').toUpperCase()}` : `${v.label} · ${(v.ext || 'mp4').toUpperCase()}`;
    box.appendChild(a);
  });
  $('pin-result').hidden = false;
}

const I18N = {
  ar: {
    stats_line: '{n} زائر لحد دلوقتي',

    _dir: 'rtl', _lang_btn: 'English', theme_title: 'الوضع الفاتح / الداكن',
    pill_badge: 'جديد', pill_text: 'إصدار 2026',
    h1: 'حمّل فيديوهاتك بسهولة',
    sub: 'الصق الرابط واختار الجودة وحمّل',
    url_label: 'لينك الفيديو', ph: 'https://www.pinterest.com/pin/…', paste_title: 'لصق',
    go: 'هات الفيديو', going: 'بجيب الفيديو…',
    foot_how: 'كيفية التنزيل', foot_why: 'ليه نوفا؟', foot_about: 'عن نوفا', foot_faq: 'الأسئلة الشائعة', chip_free: 'مجاني', chip_nolimits: 'بلا حدود', chip_online: 'عبر الإنترنت', chip_fast: 'سريع', chip_private: 'خاص', chip_oss: 'GitHub',
    choose_quality: 'اختار الجودة',
    howto_save_t: 'إزاي تحفظه',
    howto_save_b: 'دوس على الجودة، الفيديو هيفتح لوحده في صفحة جديدة. شغّله، ومن ⋮ اختار «تنزيل» وهيتحفظ على موبايلك. بنترست مانعة التحميل بضغطة واحدة من أي موقع خارجي.',
    ready_t: 'جاهز يتحمّل', dl_btn: 'تحميل الفيديو',
    fallback_t: 'التحميل المباشر متعذر',
    fallback_b: 'الموقع اللي عليه الفيديو مانع التحميل من هنا. افتحه من اللينك ده واحفظه من ⋮ ثم «تنزيل»:',
    fallback_open: 'فتح الفيديو',
    ok_t: 'اتحمّل ✓', ok_b: 'الفيديو نزل على جهازك.',
    about_h: 'نوفا - أداة مجانية لتنزيل الفيديو عبر الإنترنت لعام 2026',
    mock_dl: 'تنزيل',
    mock_cancel: 'إلغاء', mock_demo: 'معاينة',
    about_chip: 'جودة أصلية',
    about_p1: 'نوفا أداة مجانية عبر الإنترنت تتيح لك تنزيل فيديوهات بنترست والفيديوهات من الروابط المباشرة بصيغتها الأصلية خلال بضع نقرات فقط.',
    about_p2: 'عند لصق الرابط، يقوم نوفا بعرض خيارات الجودة المتاحة في المصدر لتختار الأنسب، ويتم التحميل على جهازك مباشرة بلا حساب ولا خطوات غير ضرورية.',
    how_h: 'كيفية تنزيل الفيديو عبر الإنترنت',
    step1_t: 'انسخ رابط الفيديو', step1_b: 'انتقل إلى بنترست وابحث عن الفيديو الذي تريد تنزيله. انسخ رابط البين ثم الصقه في نوفا.',
    step2_t: 'اختر الجودة', step2_b: 'سيقوم نوفا بتحليل الرابط تلقائيًا وعرض صيغ الفيديو وخيارات الجودة المتاحة. اختر الجودة التي تناسبك.',
    step3_t: 'انقر على زر التنزيل', step3_b: 'انقر على الجودة التي تفضلها، وسيفتح الفيديو في صفحة جديدة؛ من قائمة ⋮ اختر «تنزيل» ليُحفظ على جهازك.',
    fmt_h: 'الصيغ والجودات',
    fmt_b1: 'من بنترست: جميع جودات MP4 الأصلية المتوفرة داخل البين نفسه، من أقل دقة إلى أعلى دقة نشرها صاحب المحتوى - بدون تحسين أو تكبير. ومن الروابط المباشرة: يُحفظ الفيديو بصيغته الأصلية كما هي (MP4 أو WebM أو MOV).',
    fmt_b2: 'تحويل الصيغ - مثل استخراج الصوت بصيغة MP3 - غير متاح حاليًا، لأنه يحتاج إلى معالجة على خادم، ونوفا يعمل بالكامل على جهازك في الوقت الحالي.',
    feat_h: 'ليه نوفا؟',
    feat1_t: 'كل الصيغ والجودات المتاحة', feat1_b: 'جميع جودات MP4 الأصلية من المصدر كما نشرها صاحب المحتوى، لتختار منها ما يناسبك. استخراج الصوت MP3 غير متاح حاليًا.',
    feat2_t: 'خصوصية', feat2_b: 'رابطك يذهب إلى موقع الفيديو فقط لجلب الجودات. لا حسابات ولا وسطاء - التحميل يتم على جهازك مباشرة.',
    feat3_t: 'GitHub', feat3_b: 'الكود منشور على جيت هاب برخصة MIT - اقرأه وعدّله واستخدمه بحرية.',
    feat4_t: 'اعتذار عن الإعلانات', feat4_b: 'هنضيف إعلانات صغيرة وهادئة قريبًا، وهي اللي هتساعدنا نكمّل نوفا ونطوّره. شكرًا لتفهّمكم.',
    feat5_t: 'يدعم المزيد من الروابط',
    feat5_b: 'يدعم نوفا روابط بنترست العامة الكاملة، إضافة إلى أي رابط فيديو مباشر ينتهي بـ MP4 أو WebM أو MOV. روابط pin.it المختصرة لا تعمل بلصقها مباشرة: افتحها في المتصفح أولًا ثم انسخ الرابط الكامل.',
    feat6_t: 'أكثر أمانًا وأسهل استخدامًا',
    feat6_b: 'تم تصميم نوفا لجعل عملية التنزيل بسيطة وخاصة وخالية من التعقيد. لا حاجة إلى إنشاء حساب، ولا خطوات غير ضرورية تبطئك.',
    plat_plan: 'مخطط دعمها لاحقًا (غير متاحة الآن):',
    plat_h: 'المنصات المدعومة',
    plat_sub: 'يدعم نوفا حاليًا فيديوهات بنترست العامة، إضافة إلى أي رابط فيديو مباشر.',
    plat_pin: 'بنترست', plat_pin_b: 'فيديوهات البين العامة بكل جوداتها الأصلية.',
    plat_direct: 'لينكات مباشرة', plat_direct_b: 'أي لينك فيديو مباشر ينتهي بـ mp4 أو webm أو mov.',
    plat_no: 'غير مدعومة في نسخة المتصفح الحالية: يوتيوب، تيك توك، فيسبوك، إنستغرام، إكس. هذه المنصات تمنع التحميل المباشر من المتصفح ودعمها يحتاج خادمًا خاصًا - ولا نعلن عن أي منصة إلا بعد أن تعمل فعلًا.',
    faq_h: 'الأسئلة الشائعة',
    faq1_q: 'لماذا لا يعمل رابط pin.it المختصر مباشرة؟',
    faq1_a: 'روابط pin.it تحتاج أن تُفتح أولًا: افتح الرابط في المتصفح، وسيتحوّل إلى الرابط الطويل؛ انسخه من شريط العنوان ثم الصقه هنا. ملحوظة: بعض البينات لا تتاح للتنزيل حتى بالرابط الطويل إذا لم يشارك Pinterest بيانات الفيديو.',
    faq2_q: 'لماذا لا تظهر أي صيغ متاحة للتنزيل؟',
    faq2_a: 'قد يكون البين قد حُذف أو جُعل خاصًا (سريًا)، أو أن الرابط يحتوي على صورة وليس فيديو. يرجى التحقق من الرسالة المعروضة على الصفحة لمزيد من التفاصيل.',
    faq3_q: 'لماذا يفتح الفيديو في المشغّل بدلًا من تنزيل الملف مباشرة؟',
    faq3_a: 'بالنسبة لبعض الفيديوهات، قد يؤدي النقر على زر التنزيل إلى فتح الفيديو مباشرة في المتصفح بدلًا من بدء التنزيل تلقائيًا، لأن بنترست تمنع التحميل بضغطة واحدة من المواقع الخارجية. إذا حدث ذلك، انقر على قائمة النقاط الثلاث ⋮ في المشغل واختر «تنزيل».',
    faq4_q: 'هل يمكنني تنزيل MP3 أو صيغ أخرى؟',
    faq4_a: 'حاليًا يُحفظ الفيديو بصيغته الأصلية (MP4 من بنترست). استخراج الصوت MP3 أو التحويل لصيغ أخرى يحتاج خادم تحويل، وهو غير متاح في نوفا الآن.',
    faq5_q: 'هل يمكن التنزيل من يوتيوب أو تيك توك أو فيسبوك أو إنستغرام؟',
    faq5_a: 'لا، ليس في نسخة المتصفح الحالية: هذه المنصات تمنع التحميل المباشر من المتصفح وتحتاج خادمًا خاصًا. نوفا يعمل الآن مع بنترست والروابط المباشرة فقط، ولا نعلن عن أي منصة إلا بعد أن تعمل فعلًا.',
    faq6_q: 'هل يمكنني تنزيل قوائم تشغيل أو حسابات كاملة؟',
    faq6_a: 'لا، تنزيل قوائم التشغيل والحسابات الكاملة غير مدعوم حاليًا. لتنزيل عدة فيديوهات، انسخ كل رابط والصقه بشكل منفصل.',
    faq7_q: 'هل تنزيل الفيديو قانوني؟',
    faq7_a: 'يعتمد ذلك على القوانين المحلية في بلدك وعلى طريقة استخدامك للمحتوى. نزّل فقط الفيديوهات التي تملكها، أو الموجودة ضمن الملكية العامة، أو التي لديك إذن بحفظها.',
    faq8_q: 'لماذا لا تظهر خيارات جودة عالية مثل 1080p أو 4K؟',
    faq8_a: 'تعتمد خيارات الجودة المتاحة على الفيديو الأصلي في المصدر. نعرض أعلى درجات الدقة المتوفرة فعلًا، لكن بعض الفيديوهات لا توفر نسخًا بدقة 1080p أو أعلى لأن صاحب المحتوى نشرها هكذا.',
    faq9_q: 'هل يمكنني تنزيل البث المباشر؟',
    faq9_a: 'لا، لا يمكن تنزيل البث المباشر أثناء استمراره. بعد انتهاء البث ونشر الفيديو كاملًا في المصدر، يمكن تنزيله بالطريقة المعتادة.',
    faq10_q: 'لماذا لا يعمل الفيديو الذي نزّلته، أو يوجد صوت بلا صورة؟',
    faq10_a: 'جرّب جودة أخرى من القائمة وأعد التنزيل. بعض الروابط تكون فيديو بلا صوت من المصدر نفسه، وبعض المشغّلات لا تدعم كل الصيغ - جرّب مشغّلًا أحدث أو افتح الملف في المتصفح.',
    footer1: 'الجودات المعروضة هي الموجودة فعلًا في المصدر - بدون تحسين أو تكبير.',
    footer2: 'لسنا تابعين لجوجل أو يوتيوب ولا نستضيف أي محتوى. نزّل فقط المحتوى الذي تملكه أو المصرح لك بحفظه - فيديو أو صورة - والتزم بالقوانين المحلية وشروط المنصة.',
    footer3: 'GitHub',
    rate_h: 'قيّم نوفا', rate_note: 'اختار عدد النجوم - تقييمك بيتحفظ على جهازك بس، مش بيتبعت لأي حد.', rate_saved: 'شكرًا! تقييمك اتحفظ على جهازك ✦', rate_pub: 'عايز تقييمك يبان للناس؟ اديلنا نجمة على جيت هاب:', rate_gh: 'نجمة على جيت هاب',
    pin_default: 'فيديو بنترست',
    err_short_t: 'اللينك المختصر ده', err_short_b: 'لينكات pin.it محتاجة تتفتح الأول: افتح اللينك في المتصفح، هيتحوّل للينك طويل، انسخه من شريط العنوان والصقه هنا. وبعض البينات مش بتتاح حتى باللينك الطويل لو Pinterest مش بيشارك بيانات الفيديو.',
    err_bad_t: 'اللينك مش واضح', err_bad_b: 'الصق لينك بين من بنترست (زي pinterest.com/pin/…) أو لينك فيديو مباشر ينتهي بـ mp4.',
    err_notfound_t: 'مش لاقي البين ده', err_notfound_b: 'اتأكد إن اللينك صح وإن البين عام مش سري.',
    err_novideo_t: 'مقدرناش نلاقي الفيديو', err_novideo_b: 'البين ده إما صورة مش فيديو، أو بينترست مش بيدينا بيانات الفيديو بتاعته، فمش قادرين نوفّر تحميله هنا.',
    err_network_t: 'مشكلة في الاتصال', err_network_b: 'النت قطع أو بنترست ماردش. جرّب تاني.',
  },

  en: {
    stats_line: '{n} visitors so far',

    _dir: 'ltr', _lang_btn: 'عربي', theme_title: 'Light / dark mode',
    pill_badge: 'NEW', pill_text: '2026 edition',
    h1: 'Download your videos easily',
    sub: 'Paste the link, choose the quality, and download.',
    url_label: 'Video link', ph: 'https://www.pinterest.com/pin/…', paste_title: 'Paste',
    go: 'Get video', going: 'Fetching…',
    foot_how: 'How to download', foot_why: 'Why NOVA?', foot_about: 'About NOVA', foot_faq: 'FAQ', chip_free: 'Free', chip_nolimits: 'No limits', chip_online: 'Online', chip_fast: 'Fast', chip_private: 'Private', chip_oss: 'GitHub',
    choose_quality: 'Choose quality',
    howto_save_t: 'How to save it',
    howto_save_b: 'Tap a quality and the video opens alone in a new tab. Play it, then choose "Download" from the ⋮ menu to save it. Pinterest blocks one-tap downloads from external sites.',
    ready_t: 'Ready to download', dl_btn: 'Download video',
    fallback_t: 'Direct download blocked',
    fallback_b: 'The site hosting this video blocks downloads from here. Open it from this link and save it via ⋮ then "Download":',
    fallback_open: 'Open video',
    ok_t: 'Downloaded ✓', ok_b: 'The video is on your device.',
    about_h: 'NOVA - a free online video downloader for 2026',
    mock_dl: 'Download',
    mock_cancel: 'Cancel', mock_demo: 'Preview',
    about_chip: 'Original quality',
    about_p1: 'NOVA is a free online tool that lets you download Pinterest videos and videos from direct links in their original format in just a few clicks.',
    about_p2: 'Paste a link and NOVA shows the quality options available at the source so you can pick the best one. Downloads happen on your device - no account, no unnecessary steps.',
    how_h: 'How to download videos online',
    step1_t: 'Copy the video link', step1_b: 'Go to Pinterest and find the video you want to download. Copy the pin link, then paste it into NOVA.',
    step2_t: 'Choose the quality', step2_b: 'NOVA automatically analyzes the link and shows the available video formats and quality options. Pick the one that suits you.',
    step3_t: 'Click the download button', step3_b: 'Click the quality you prefer and the video opens in a new tab; from the three-dot menu choose Download to save it to your device.',
    fmt_h: 'Formats & quality',
    fmt_b1: 'From Pinterest: every original MP4 quality available in the pin itself, from the lowest resolution to the highest the creator published - no enhancement, no upscaling. From direct links: the video is saved in its original format as-is (MP4, WebM or MOV).',
    fmt_b2: 'Format conversion - like extracting MP3 audio - is not available yet, because it needs real server-side processing, and NOVA currently runs entirely on your device.',
    feat_h: 'Why NOVA?',
    feat1_t: 'All available formats and qualities', feat1_b: 'All original MP4 qualities from the source as posted by the creator - pick what suits you. MP3 audio extraction is not available at the moment.',
    feat2_t: 'Privacy', feat2_b: 'Your link goes only to the video site to fetch the qualities. No accounts, no middlemen - the download happens directly on your device.',
    feat3_t: 'GitHub', feat3_b: 'The code is published on GitHub under the MIT license - read it, modify it, use it freely.',
    feat4_t: 'A note about ads', feat4_b: 'We will soon add a few small, quiet ads to help us keep NOVA going. Thank you for understanding.',
    feat5_t: 'More link types',
    feat5_b: 'NOVA supports full public Pinterest links, plus any direct video link ending in MP4, WebM or MOV. Short pin.it links do not work when pasted directly: open them in the browser first, then copy the full link.',
    feat6_t: 'Safer and easier to use',
    feat6_b: 'NOVA is designed to make downloading simple, private and uncomplicated. No account needed, and no unnecessary steps slowing you down.',
    plat_plan: 'Planned for later (not available now):',
    plat_h: 'Supported platforms',
    plat_sub: 'NOVA currently supports public Pinterest videos, plus any direct video link.',
    plat_pin: 'Pinterest', plat_pin_b: 'Public pin videos in all their original qualities.',
    plat_direct: 'Direct links', plat_direct_b: 'Any direct video link ending in mp4, webm, or mov.',
    plat_no: 'Not supported in the current browser version: YouTube, TikTok, Facebook, Instagram, X. These platforms block direct in-browser downloads and need a dedicated server - and we never list a platform until it actually works.',
    faq_h: 'FAQ',
    faq1_q: 'Why does the short pin.it link not work directly?',
    faq1_a: 'pin.it links need to be opened first: open the link in your browser, it turns into the long link - copy it from the address bar and paste it here. Note: some pins cannot be downloaded even with the full link if Pinterest does not share their video data.',
    faq2_q: 'Why do I not see any formats available for download?',
    faq2_a: 'The pin may have been deleted or made private (secret), or the link contains a photo instead of a video. Check the message shown on the page for details.',
    faq3_q: 'Why does the video open in a player instead of downloading the file?',
    faq3_a: 'For some videos, clicking download may open the video directly in the browser instead of saving it, because Pinterest blocks one-click downloads from external sites. If that happens, open the three-dot menu in the player and choose Download.',
    faq4_q: 'Can I download MP3 or other formats?',
    faq4_a: 'Right now the video is saved in its original format (MP4 from Pinterest). Extracting MP3 audio or converting to other formats needs a conversion server and is not available in NOVA yet.',
    faq5_q: 'Can I download from YouTube, TikTok, Facebook or Instagram?',
    faq5_a: 'No - not in the current browser version: these platforms block direct in-browser downloads and need a dedicated server. NOVA currently works with Pinterest and direct links only, and we never list a platform until it actually works.',
    faq6_q: 'Can I download playlists or whole accounts?',
    faq6_a: 'No, downloading playlists or full accounts is not supported at the moment. To download several videos, copy and paste each link separately.',
    faq7_q: 'Is downloading videos legal?',
    faq7_a: 'That depends on the local laws in your country and how you use the content. Only download videos you own, that are in the public domain, or that you have permission to save.',
    faq8_q: 'Why do I not see high-quality options like 1080p or 4K?',
    faq8_a: 'Available quality options depend on the original video at the source. We show the highest resolutions actually available, but some videos are only posted at lower quality by the creator.',
    faq9_q: 'Can I download live streams?',
    faq9_a: 'No, a live stream cannot be downloaded while it is still running. After the stream ends and the full video is published at the source, it can be downloaded the usual way.',
    faq10_q: 'Why does my downloaded video not play, or has audio but no picture?',
    faq10_a: 'Try another quality from the list and download again. Some links are video-only at the source, and some players do not support every format - try a newer player or open the file in your browser.',
    footer1: 'The listed qualities are the ones that actually exist at the source - no enhancement or upscaling.',
    footer2: 'We are not affiliated with Google or YouTube and we do not host any content. Only download content you own or are permitted to save - video or photo - and follow local laws and platform terms.',
    footer3: 'GitHub',
    rate_h: 'Rate NOVA', rate_note: 'Pick a number of stars - your rating stays on your device only, never sent anywhere.', rate_saved: 'Thanks! Your rating is saved on your device ✦', rate_pub: 'Want your rating to be public? Give us a star on GitHub:', rate_gh: 'Star on GitHub',
    pin_default: 'Pinterest video',
    err_short_t: 'That short link', err_short_b: "pin.it links need to be opened first: open the link in your browser, it turns into the long link - copy it from the address bar and paste it here. Some pins are unavailable even with the long link when Pinterest doesn't share their video data.",
    err_bad_t: 'Unclear link', err_bad_b: 'Paste a Pinterest pin link (like pinterest.com/pin/…) or a direct video link ending in mp4.',
    err_notfound_t: 'Pin not found', err_notfound_b: 'Check the link is correct and the pin is public, not secret.',
    err_novideo_t: "We couldn't find the video", err_novideo_b: "This pin is either an image, not a video, or Pinterest isn't sharing its video data with us, so we can't offer it for download here.",
    err_network_t: 'Connection problem', err_network_b: 'The network dropped or Pinterest did not respond. Try again.',
  },

  fr: {
    stats_line: '{n} visiteurs jusqu\'ici',
"pill_badge": "NOUVEAU", "pill_text": "Édition 2026", "about_chip": "Qualité originale", "mock_cancel": "Annuler", "mock_dl": "Télécharger", "h1": "Téléchargez vos vidéos facilement", "sub": "Collez le lien, choisissez la qualité et téléchargez.", "url_label": "Lien de la vidéo", "ph": "https://www.pinterest.com/pin/…", "paste_title": "Coller", "go": "Obtenir la vidéo", "going": "Récupération…", "chip_free": "Gratuit", "chip_nolimits": "Sans compte", "chip_fast": "Rapide", "chip_private": "Privé", "chip_oss": "GitHub", "choose_quality": "Choisir la qualité", "howto_save_t": "Comment l'enregistrer", "howto_save_b": "Touchez une qualité et la vidéo s'ouvre seule dans un nouvel onglet. Lancez-la, puis choisissez « Télécharger » dans le menu ⋮ pour l'enregistrer. Pinterest bloque les téléchargements en un geste depuis les sites externes.", "ready_t": "Prête à télécharger", "dl_btn": "Télécharger la vidéo", "fallback_t": "Téléchargement direct bloqué", "fallback_b": "Le site hébergeant cette vidéo bloque les téléchargements depuis ici. Ouvrez-la depuis ce lien et enregistrez-la via ⋮ puis « Télécharger » :", "fallback_open": "Ouvrir la vidéo", "ok_t": "Téléchargée ✓", "ok_b": "La vidéo est sur votre appareil.", "about_h": "NOVA - un téléchargeur de vidéos en ligne gratuit pour 2026", "about_p1": "NOVA est un outil gratuit qui fonctionne directement dans votre navigateur : il vous permet d'enregistrer les vidéos Pinterest et les liens vidéo directs dans leur format d'origine, en quelques secondes et sans étapes compliquées.", "about_p2": "Pas de comptes : la page ne communique qu'avec le site de la vidéo pour récupérer les qualités, et le téléchargement se fait directement sur votre appareil - vos liens et vos vidéos ne sont jamais enregistrés chez nous.", "how_h": "Comment télécharger des vidéos en ligne", "step1_t": "Copiez le lien de la vidéo", "step1_b": "Allez sur Pinterest, trouvez la vidéo à enregistrer et copiez le lien complet de l'épingle depuis la barre d'adresse.", "step2_t": "Collez-le et choisissez une qualité", "step2_b": "Collez le lien ci-dessus et appuyez sur « Obtenir la vidéo ». NOVA analyse automatiquement le lien et affiche les formats et qualités disponibles à la source.", "step3_t": "Enregistrez-la sur votre appareil", "step3_b": "Choisissez la qualité qui vous convient - la vidéo s'ouvre dans un nouvel onglet ; depuis le menu ⋮ choisissez « Télécharger » pour l'enregistrer sur votre appareil.", "fmt_h": "Formats et qualité", "fmt_b1": "Depuis Pinterest : toutes les qualités MP4 d'origine disponibles dans l'épingle elle-même, de la plus basse à la plus haute résolution publiée par le créateur - sans amélioration ni redimensionnement. Depuis les liens directs : la vidéo est enregistrée dans son format d'origine tel quel (MP4, WebM ou MOV).", "fmt_b2": "La conversion de format - comme l'extraction audio MP3 - n'est pas encore disponible, car elle demande un vrai traitement sur serveur, et NOVA fonctionne actuellement entièrement sur votre appareil.", "feat_h": "Pourquoi NOVA ?", "feat1_t": "Tous les formats et qualités disponibles", "feat1_b": "Toutes les qualités MP4 d'origine de Pinterest telles que publiées par le créateur ; les liens directs sont enregistrés dans leur format d'origine. L'extraction audio MP3 n'est pas encore disponible.", "feat2_t": "Confidentialité", "feat2_b": "Votre lien va uniquement au site de la vidéo pour récupérer les qualités. Pas de comptes ni d'intermédiaires - le téléchargement se fait directement sur votre appareil.", "feat3_t": "GitHub", "feat3_b": "Le code est publié sur GitHub sous licence MIT - lisez-le, modifiez-le, utilisez-le librement.", "feat4_t": "Un mot sur les pubs", "feat4_b": "Nous ajouterons bientôt quelques petites publicités discrètes pour nous aider à faire vivre NOVA. Merci de votre compréhension.", "plat_h": "Plateformes prises en charge", "plat_pin": "Pinterest", "plat_pin_b": "Vidéos de pins publics dans toutes leurs qualités originales.", "plat_direct": "Liens directs", "plat_direct_b": "Tout lien vidéo direct se terminant par mp4, webm ou mov.", "feat5_t": "Plus de types de liens", "feat5_b": "Compatible avec les liens Pinterest publics complets et tout lien vidéo direct en MP4, WebM ou MOV. Les liens courts pin.it ne fonctionnent pas collés directement: ouvrez-les d'abord dans le navigateur, puis copiez le lien complet.", "feat6_t": "Plus simple et plus sûr", "feat6_b": "Conçu pour un téléchargement simple et privé : pas de popups ni de redirections forcées, pas de comptes, aucune étape qui vous ralentit.", "plat_plan": "Prévu pour plus tard (non disponible actuellement) :", "plat_no": "Non prises en charge dans la version navigateur actuelle : YouTube, TikTok, Facebook, Instagram, X. Ces plateformes bloquent le téléchargement direct dans le navigateur et demandent un serveur dédié - et nous ne listons une plateforme que lorsqu'elle fonctionne réellement.", "faq_h": "FAQ", "faq1_q": "Pourquoi le lien court pin.it ne fonctionne-t-il pas directement ?", "faq1_a": "Les liens pin.it doivent d'abord être ouverts : ouvrez le lien dans votre navigateur, il devient le lien long - copiez-le depuis la barre d'adresse et collez-le ici. Certains pins ne sont pas téléchargeables même avec le lien complet si Pinterest ne partage pas leurs données vidéo.", "faq2_q": "Pourquoi ne vois-je aucun format disponible au téléchargement ?", "faq2_a": "L'épingle a peut-être été supprimée, rendue privée (secrète), ou contient une image et non une vidéo. Vérifiez que le lien ouvre une vidéo publique, puis réessayez.", "faq3_q": "Pourquoi la vidéo s'ouvre-t-elle dans un lecteur au lieu de télécharger le fichier ?", "faq3_a": "Pinterest bloque les téléchargements en un geste depuis les sites externes. Touchez une qualité, lancez la vidéo dans le nouvel onglet, puis choisissez « Télécharger » dans le menu ⋮.", "faq4_q": "Puis-je télécharger en MP3 ou dans d'autres formats ?", "faq4_a": "Pour l'instant, la vidéo est enregistrée dans son format d'origine (MP4 depuis Pinterest). L'extraction audio MP3 ou la conversion vers d'autres formats demande un serveur de conversion et n'est pas encore disponible dans NOVA.", "faq5_q": "Puis-je télécharger depuis YouTube, TikTok, Facebook ou Instagram ?", "faq5_a": "Non, pas dans la version navigateur actuelle : ces plateformes bloquent le téléchargement direct dans le navigateur et demandent un serveur dédié. NOVA fonctionne actuellement uniquement avec Pinterest et les liens directs, et nous ne listons une plateforme que lorsqu'elle fonctionne réellement.", "faq6_q": "Puis-je télécharger des playlists ou des comptes entiers ?", "faq6_a": "Non, ce n'est pas encore pris en charge. Pour enregistrer plusieurs vidéos, copiez et collez chaque lien séparément.", "faq7_q": "Le téléchargement de vidéos est-il légal ?", "faq7_a": "Cela dépend des lois de votre pays et de l'usage que vous faites du contenu. Ne téléchargez que du contenu que vous possédez ou êtes autorisé à enregistrer - vidéo ou photo - et respectez les conditions de chaque plateforme. NOVA ne bloque pas un téléchargement au seul motif que le contenu est protégé, mais la responsabilité de votre usage vous revient.", "faq8_q": "Pourquoi ne vois-je pas d'options haute qualité comme 1080p ou 4K ?", "faq8_a": "Les qualités affichées dépendent de la vidéo d'origine à la source. NOVA montre toutes les qualités réellement présentes, mais certaines vidéos n'existent qu'en basse résolution car le créateur les a publiées ainsi - nous n'agrandissons ni n'améliorons jamais la qualité artificiellement.", "faq9_q": "Puis-je télécharger des diffusions en direct ?", "faq9_a": "Non. NOVA enregistre uniquement les vidéos publiées après la fin du direct ; une diffusion en cours ne peut pas être téléchargée comme fichier.", "faq10_q": "Pourquoi la vidéo téléchargée ne se lit-elle pas, ou a du son sans image ?", "faq10_a": "Essayez une autre qualité dans la liste et retéléchargez. Certains liens directs sont sans son à la source, et certains lecteurs ne prennent pas en charge tous les formats - essayez un autre lecteur comme VLC.", "footer1": "Les qualités affichées sont celles réellement présentes à la source - sans amélioration ni agrandissement.", "footer2": "Ne téléchargez que du contenu que vous possédez ou êtes autorisé à enregistrer - vidéo ou photo - et respectez les droits des détenteurs.", "footer3": "GitHub", "rate_h": "Notez NOVA", "rate_note": "Choisissez un nombre d'étoiles - votre note reste uniquement sur votre appareil, jamais envoyée.", "rate_saved": "Merci ! Votre note est enregistrée sur votre appareil ✦", "rate_pub": "Vous voulez une note publique ? Donnez-nous une étoile sur GitHub :", "rate_gh": "Étoile sur GitHub", "pin_default": "Vidéo Pinterest", "err_short_t": "Ce lien court", "err_short_b": "Les liens pin.it doivent d'abord être ouverts : ouvrez le lien dans votre navigateur, il devient le lien long - copiez-le depuis la barre d'adresse et collez-le ici. Certains pins ne sont pas téléchargeables même avec le lien complet si Pinterest ne partage pas leurs données vidéo.", "err_bad_t": "Lien peu clair", "err_bad_b": "Collez un lien de pin Pinterest (comme pinterest.com/pin/…) ou un lien vidéo direct se terminant par mp4.", "err_notfound_t": "Pin introuvable", "err_notfound_b": "Vérifiez que le lien est correct et que le pin est public, pas secret.", "err_novideo_t": "Vidéo introuvable", "err_novideo_b": "Ce pin est soit une image et non une vidéo, soit Pinterest ne partage pas ses données vidéo avec nous - nous ne pouvons donc pas le proposer au téléchargement ici.", "err_network_t": "Problème de connexion", "err_network_b": "Le réseau a coupé ou Pinterest n'a pas répondu. Réessayez.", "theme_title": "Mode clair / sombre", "_dir": "ltr"},

  es: {
    stats_line: '{n} visitantes hasta ahora',
"pill_badge": "NUEVO", "pill_text": "Edición 2026", "about_chip": "Calidad original", "mock_cancel": "Cancelar", "mock_dl": "Descargar", "h1": "Descarga videos con facilidad", "sub": "Pega el enlace, elige la calidad y descarga.", "url_label": "Enlace del video", "ph": "https://www.pinterest.com/pin/…", "paste_title": "Pegar", "go": "Obtener video", "going": "Obteniendo…", "chip_free": "Gratis", "chip_nolimits": "Sin cuenta", "chip_fast": "Rápido", "chip_private": "Privado", "chip_oss": "GitHub", "choose_quality": "Elige la calidad", "howto_save_t": "Cómo guardarlo", "howto_save_b": "Toca una calidad y el video se abre solo en una pestaña nueva. Reprodúcelo y luego elige «Descargar» en el menú ⋮ para guardarlo. Pinterest bloquea las descargas de un toque desde sitios externos.", "ready_t": "Listo para descargar", "dl_btn": "Descargar video", "fallback_t": "Descarga directa bloqueada", "fallback_b": "El sitio que aloja este video bloquea las descargas desde aquí. Ábrelo desde este enlace y guárdalo con ⋮ y luego «Descargar»:", "fallback_open": "Abrir video", "ok_t": "Descargado ✓", "ok_b": "El video está en tu dispositivo.", "about_h": "NOVA - un descargador de videos en línea gratuito para 2026", "about_p1": "NOVA es una herramienta gratuita que funciona directamente en tu navegador: te permite guardar videos de Pinterest y enlaces de video directos en su formato original, en segundos y sin pasos complicados.", "about_p2": "Sin cuentas: la página solo se comunica con el sitio del video para obtener las calidades, y la descarga ocurre directamente en tu dispositivo - tus enlaces y videos nunca se guardan de nuestro lado.", "how_h": "Cómo descargar videos en línea", "step1_t": "Copia el enlace del video", "step1_b": "Ve a Pinterest, encuentra el video que quieres guardar y copia el enlace completo del pin desde la barra de direcciones.", "step2_t": "Pégalo y elige una calidad", "step2_b": "Pega el enlace arriba y pulsa «Obtener video». NOVA analiza el enlace automáticamente y muestra los formatos y calidades disponibles en la fuente.", "step3_t": "Guárdalo en tu dispositivo", "step3_b": "Elige la calidad que prefieras - el video se abre en una pestaña nueva; desde el menú ⋮ elige «Descargar» para guardarlo en tu dispositivo.", "fmt_h": "Formatos y calidad", "fmt_b1": "Desde Pinterest: todas las calidades MP4 originales disponibles en el propio pin, desde la más baja hasta la máxima publicada por el creador - sin mejora ni escalado. Desde enlaces directos: el video se guarda en su formato original tal cual (MP4, WebM o MOV).", "fmt_b2": "La conversión de formato - como extraer audio MP3 - aún no está disponible, porque necesita procesamiento real en un servidor, y NOVA actualmente funciona por completo en tu dispositivo.", "feat_h": "¿Por qué NOVA?", "feat1_t": "Todos los formatos y calidades disponibles", "feat1_b": "Todas las calidades MP4 originales de Pinterest tal como las publicó el creador; los enlaces directos se guardan en su formato original. La extracción de audio MP3 aún no está disponible.", "feat2_t": "Privacidad", "feat2_b": "Tu enlace va solo al sitio del video para obtener las calidades. Sin cuentas ni intermediarios: la descarga se hace directamente en tu dispositivo.", "feat3_t": "GitHub", "feat3_b": "El código se publica en GitHub bajo licencia MIT - léelo, modifícalo y úsalo libremente.", "feat4_t": "Una nota sobre los anuncios", "feat4_b": "Pronto añadiremos algunos anuncios pequeños y discretos para ayudarnos a mantener NOVA. Gracias por tu comprensión.", "plat_h": "Plataformas compatibles", "plat_pin": "Pinterest", "plat_pin_b": "Videos de pines públicos en todas sus calidades originales.", "plat_direct": "Enlaces directos", "plat_direct_b": "Cualquier enlace directo de video que termine en mp4, webm o mov.", "feat5_t": "Más tipos de enlaces", "feat5_b": "Funciona con enlaces públicos completos de Pinterest y con cualquier enlace de video directo en MP4, WebM o MOV. Los enlaces cortos pin.it no funcionan al pegarlos directamente: ábralos primero en el navegador y copie el enlace completo.", "feat6_t": "Más fácil y más seguro", "feat6_b": "Diseñado para que descargar sea simple y privado: sin ventanas emergentes ni redirecciones forzadas, sin cuentas y sin pasos que te retrasen.", "plat_plan": "Planificado para más adelante (no disponible ahora):", "plat_no": "No compatibles en la versión actual del navegador: YouTube, TikTok, Facebook, Instagram, X. Estas plataformas bloquean la descarga directa en el navegador y necesitan un servidor dedicado - y nunca listamos una plataforma hasta que funciona de verdad.", "faq_h": "Preguntas frecuentes", "faq1_q": "¿Por qué el enlace corto pin.it no funciona directamente?", "faq1_a": "Los enlaces pin.it deben abrirse primero: abre el enlace en tu navegador, se convierte en el enlace largo - cópialo de la barra de direcciones y pégalo aquí. Algunos pines no están disponibles ni siquiera con el enlace completo si Pinterest no comparte sus datos de video.", "faq2_q": "¿Por qué no veo ningún formato disponible para descargar?", "faq2_a": "Puede que el pin se haya eliminado, se haya vuelto privado (secreto) o que contenga una imagen y no un video. Comprueba que el enlace abra un video público e inténtalo de nuevo.", "faq3_q": "¿Por qué el video se abre en un reproductor en vez de descargar el archivo?", "faq3_a": "Pinterest bloquea las descargas de un toque desde sitios externos. Toca una calidad, reproduce el video en la pestaña nueva y elige «Descargar» en el menú ⋮.", "faq4_q": "¿Puedo descargar MP3 u otros formatos?", "faq4_a": "Por ahora el video se guarda en su formato original (MP4 desde Pinterest). Extraer audio MP3 o convertir a otros formatos necesita un servidor de conversión y aún no está disponible en NOVA.", "faq5_q": "¿Puedo descargar de YouTube, TikTok, Facebook o Instagram?", "faq5_a": "No, no en la versión actual del navegador: esas plataformas bloquean la descarga directa en el navegador y necesitan un servidor dedicado. NOVA funciona actualmente solo con Pinterest y enlaces directos, y nunca listamos una plataforma hasta que funciona de verdad.", "faq6_q": "¿Puedo descargar listas de reproducción o cuentas completas?", "faq6_a": "No, aún no está disponible. Para guardar varios videos, copia y pega cada enlace por separado.", "faq7_q": "¿Es legal descargar videos?", "faq7_a": "Depende de las leyes de tu país y del uso que hagas del contenido. Descarga solo contenido que te pertenezca o que tengas permiso para guardar - video o foto - y respeta los términos de cada plataforma. NOVA no bloquea una descarga solo porque el contenido tenga derechos de autor, pero la responsabilidad del uso es tuya.", "faq8_q": "¿Por qué no veo opciones de alta calidad como 1080p o 4K?", "faq8_a": "Las calidades mostradas dependen del video original en la fuente. NOVA muestra todas las calidades realmente disponibles, pero algunos videos solo existen en menor resolución porque así los publicó el creador - nunca escalamos ni mejoramos la calidad artificialmente.", "faq9_q": "¿Puedo descargar transmisiones en vivo?", "faq9_a": "No. NOVA guarda solo videos publicados después de que termina la transmisión; un en vivo no se puede descargar como archivo mientras se emite.", "faq10_q": "¿Por qué el video descargado no se reproduce, o tiene audio sin imagen?", "faq10_a": "Prueba otra calidad de la lista y descarga de nuevo. Algunos enlaces directos no tienen audio desde la fuente, y algunos reproductores no admiten todos los formatos: prueba otro reproductor como VLC.", "footer1": "Las calidades mostradas son las realmente presentes en la fuente - sin mejora ni escalado.", "footer2": "Descarga solo contenido que te pertenezca o que tengas permiso para guardar - video o foto - y respeta los derechos de sus titulares.", "footer3": "GitHub", "rate_h": "Califica NOVA", "rate_note": "Elige un número de estrellas - tu calificación se queda solo en tu dispositivo, nunca se envía.", "rate_saved": "¡Gracias! Tu calificación se guardó en tu dispositivo ✦", "rate_pub": "¿Quieres que tu calificación sea pública? Danos una estrella en GitHub:", "rate_gh": "Estrella en GitHub", "pin_default": "Video de Pinterest", "err_short_t": "Ese enlace corto", "err_short_b": "Los enlaces pin.it deben abrirse primero: abre el enlace en tu navegador, se convierte en el enlace largo - cópialo de la barra de direcciones y pégalo aquí. Algunos pines no están disponibles ni siquiera con el enlace completo si Pinterest no comparte sus datos de video.", "err_bad_t": "Enlace poco claro", "err_bad_b": "Pega un enlace de pin de Pinterest (como pinterest.com/pin/…) o un enlace directo de video que termine en mp4.", "err_notfound_t": "Pin no encontrado", "err_notfound_b": "Verifica que el enlace sea correcto y que el pin sea público, no secreto.", "err_novideo_t": "No pudimos encontrar el video", "err_novideo_b": "Este pin es una imagen y no un video, o Pinterest no está compartiendo sus datos de video con nosotros, así que no podemos ofrecerlo para descargar aquí.", "err_network_t": "Problema de conexión", "err_network_b": "La red se cortó o Pinterest no respondió. Inténtalo de nuevo.", "theme_title": "Modo claro / oscuro", "_dir": "ltr"},

  ru: {
    stats_line: '{n} посетителей на данный момент',
"pill_badge": "НОВОЕ", "pill_text": "Версия 2026", "about_chip": "Исходное качество", "mock_cancel": "Отмена", "mock_dl": "Скачать", "h1": "Скачивайте видео легко", "sub": "Вставьте ссылку, выберите качество и скачайте.", "url_label": "Ссылка на видео", "ph": "https://www.pinterest.com/pin/…", "paste_title": "Вставить", "go": "Скачать видео", "going": "Загрузка…", "chip_free": "Бесплатно", "chip_nolimits": "Без аккаунта", "chip_fast": "Быстро", "chip_private": "Приватно", "chip_oss": "GitHub", "choose_quality": "Выберите качество", "howto_save_t": "Как сохранить", "howto_save_b": "Нажмите на качество, и видео откроется в новой вкладке. Запустите его, затем выберите «Скачать» в меню ⋮, чтобы сохранить. Pinterest блокирует скачивание в одно нажатие с внешних сайтов.", "ready_t": "Готово к скачиванию", "dl_btn": "Скачать видео", "fallback_t": "Прямое скачивание заблокировано", "fallback_b": "Сайт, на котором размещено это видео, блокирует скачивание отсюда. Откройте его по этой ссылке и сохраните через ⋮, затем «Скачать»:", "fallback_open": "Открыть видео", "ok_t": "Скачано ✓", "ok_b": "Видео на вашем устройстве.", "about_h": "NOVA - бесплатный онлайн-загрузчик видео 2026 года", "about_p1": "NOVA - бесплатный инструмент, который работает прямо в браузере: он позволяет сохранять видео из Pinterest и прямые ссылки на видео в исходном формате - за секунды и без лишних шагов.", "about_p2": "Без аккаунтов: страница общается только с сайтом видео для получения качеств, а скачивание происходит прямо на вашем устройстве - ваши ссылки и видео у нас не сохраняются.", "how_h": "Как скачивать видео онлайн", "step1_t": "Скопируйте ссылку на видео", "step1_b": "Откройте Pinterest, найдите нужное видео и скопируйте полную ссылку на пин из адресной строки.", "step2_t": "Вставьте её и выберите качество", "step2_b": "Вставьте ссылку выше и нажмите «Скачать видео». NOVA автоматически проанализирует ссылку и покажет форматы и качества, доступные в источнике.", "step3_t": "Сохраните на устройство", "step3_b": "Выберите подходящее качество - видео откроется в новой вкладке; в меню ⋮ выберите «Скачать», чтобы сохранить его на устройство.", "fmt_h": "Форматы и качество", "fmt_b1": "Из Pinterest: все оригинальные качества MP4, доступные в самом пине, - от самого низкого до самого высокого разрешения, опубликованного автором, без улучшения и масштабирования. По прямым ссылкам: видео сохраняется в исходном формате как есть (MP4, WebM или MOV).", "fmt_b2": "Конвертация форматов - например, извлечение аудио MP3 - пока недоступна, так как требует серверной обработки, а NOVA сейчас работает полностью на вашем устройстве.", "feat_h": "Почему NOVA?", "feat1_t": "Все доступные форматы и качества", "feat1_b": "Все исходные MP4-качества Pinterest в том виде, в каком их опубликовал автор; прямые ссылки сохраняются в исходном формате. Извлечение аудио MP3 пока недоступно.", "feat2_t": "Приватность", "feat2_b": "Ваша ссылка идёт только на сайт видео для получения качеств. Без аккаунтов и посредников - скачивание происходит прямо на вашем устройстве.", "feat3_t": "GitHub", "feat3_b": "Код опубликован на GitHub под лицензией MIT - читайте, изменяйте и используйте свободно.", "feat4_t": "Пара слов о рекламе", "feat4_b": "Скоро мы добавим несколько маленьких ненавязчивых объявлений, которые помогут NOVA продолжать работу. Спасибо за понимание.", "plat_h": "Поддерживаемые платформы", "plat_pin": "Pinterest", "plat_pin_b": "Видео из публичных пинов во всех исходных качествах.", "plat_direct": "Прямые ссылки", "plat_direct_b": "Любая прямая ссылка на видео, заканчивающаяся на mp4, webm или mov.", "feat5_t": "Больше типов ссылок", "feat5_b": "Работает с полными публичными ссылками Pinterest и любыми прямыми ссылками на видео в MP4, WebM или MOV. Короткие ссылки pin.it не работают при прямой вставке: сначала откройте их в браузере и скопируйте полную ссылку.", "feat6_t": "Проще и безопаснее", "feat6_b": "Создан, чтобы скачивание было простым и приватным: без всплывающих окон и принудительных переадресаций, без аккаунтов и лишних шагов.", "plat_plan": "Планируется позже (сейчас недоступно):", "plat_no": "Не поддерживаются в текущей браузерной версии: YouTube, TikTok, Facebook, Instagram, X. Эти платформы блокируют прямое скачивание в браузере и требуют выделенного сервера - и мы не добавляем платформу, пока она реально не заработает.", "faq_h": "Частые вопросы", "faq1_q": "Почему короткая ссылка pin.it не работает напрямую?", "faq1_a": "Ссылки pin.it нужно сначала открыть: откройте ссылку в браузере, она превратится в длинную - скопируйте её из адресной строки и вставьте сюда. Некоторые пины недоступны даже по полной ссылке, если Pinterest не передаёт данные их видео.", "faq2_q": "Почему не отображаются доступные форматы для скачивания?", "faq2_a": "Возможно, пин удалён, стал приватным (секретным) или содержит изображение, а не видео. Убедитесь, что ссылка открывает публичное видео, и попробуйте снова.", "faq3_q": "Почему видео открывается в плеере вместо скачивания файла?", "faq3_a": "Pinterest блокирует скачивание в одно нажатие с внешних сайтов. Нажмите на качество, запустите видео в новой вкладке и выберите «Скачать» в меню ⋮.", "faq4_q": "Можно ли скачать MP3 или другие форматы?", "faq4_a": "Пока видео сохраняется в исходном формате (MP4 с Pinterest). Извлечение аудио MP3 или конвертация в другие форматы требуют сервера конвертации и пока недоступны в NOVA.", "faq5_q": "Можно ли скачивать с YouTube, TikTok, Facebook или Instagram?", "faq5_a": "Нет, не в текущей браузерной версии: эти платформы блокируют прямое скачивание в браузере и требуют выделенного сервера. NOVA сейчас работает только с Pinterest и прямыми ссылками, и мы не добавляем платформу, пока она реально не заработает.", "faq6_q": "Можно ли скачивать плейлисты или аккаунты целиком?", "faq6_a": "Нет, это пока не поддерживается. Чтобы сохранить несколько видео, копируйте и вставляйте каждую ссылку отдельно.", "faq7_q": "Законно ли скачивать видео?", "faq7_a": "Это зависит от законов вашей страны и от того, как вы используете контент. Скачивайте только контент, который принадлежит вам или который вам разрешено сохранять - видео или фото - и соблюдайте правила каждой платформы. NOVA не блокирует скачивание только из-за наличия авторских прав, но ответственность за использование лежит на вас.", "faq8_q": "Почему нет вариантов высокого качества, например 1080p или 4K?", "faq8_a": "Доступные качества зависят от исходного видео в источнике. NOVA показывает все реально существующие качества, но некоторые видео доступны только в низком разрешении, потому что автор опубликовал их так - мы никогда не растягиваем и не улучшаем качество искусственно.", "faq9_q": "Можно ли скачать прямую трансляцию?", "faq9_a": "Нет. NOVA сохраняет только видео, опубликованные после завершения трансляции; идущий эфир нельзя скачать как файл.", "faq10_q": "Почему скачанное видео не воспроизводится или есть звук без картинки?", "faq10_a": "Попробуйте другое качество из списка и скачайте заново. Некоторые прямые ссылки изначально без звука, а некоторые плееры поддерживают не все форматы - попробуйте другой плеер, например VLC.", "footer1": "Указанные качества - те, что реально есть у источника, без улучшения и апскейла.", "footer2": "Скачивайте только контент, который принадлежит вам или который вам разрешено сохранять - видео или фото - и уважайте права правообладателей.", "footer3": "GitHub", "rate_h": "Оцените NOVA", "rate_note": "Выберите количество звёзд - ваша оценка остаётся только на вашем устройстве и никуда не отправляется.", "rate_saved": "Спасибо! Ваша оценка сохранена на вашем устройстве ✦", "rate_pub": "Хотите публичную оценку? Поставьте нам звезду на GitHub:", "rate_gh": "Звезда на GitHub", "pin_default": "Видео Pinterest", "err_short_t": "Эта короткая ссылка", "err_short_b": "Ссылки pin.it нужно сначала открыть: откройте ссылку в браузере, она превратится в длинную - скопируйте её из адресной строки и вставьте сюда. Некоторые пины недоступны даже по полной ссылке, если Pinterest не передаёт данные их видео.", "err_bad_t": "Непонятная ссылка", "err_bad_b": "Вставьте ссылку на пин Pinterest (вроде pinterest.com/pin/…) или прямую ссылку на видео, заканчивающуюся на mp4.", "err_notfound_t": "Пин не найден", "err_notfound_b": "Проверьте, что ссылка верна и пин публичный, а не секретный.", "err_novideo_t": "Не удалось найти видео", "err_novideo_b": "Этот пин либо изображение, а не видео, либо Pinterest не делится с нами данными видео, поэтому мы не можем предложить его для скачивания здесь.", "err_network_t": "Проблема с соединением", "err_network_b": "Сеть прервалась или Pinterest не ответил. Попробуйте снова.", "theme_title": "Светлая / тёмная тема", "_dir": "ltr"},

  zh: {
    stats_line: '迄今 {n} 位访客',
"pill_badge": "新", "pill_text": "2026 版", "about_chip": "原始画质", "mock_cancel": "取消", "mock_dl": "下载", "h1": "轻松下载视频", "sub": "粘贴链接，选择画质，即可下载。", "url_label": "视频链接", "ph": "https://www.pinterest.com/pin/…", "paste_title": "粘贴", "go": "获取视频", "going": "获取中…", "chip_free": "免费", "chip_nolimits": "无需账号", "chip_fast": "快速", "chip_private": "私密", "chip_oss": "GitHub", "choose_quality": "选择画质", "howto_save_t": "如何保存", "howto_save_b": "点击画质，视频会在新标签页中单独打开。播放它，然后从 ⋮ 菜单选择“下载”即可保存。Pinterest 会阻止外部网站的一键下载。", "ready_t": "可以下载了", "dl_btn": "下载视频", "fallback_t": "直接下载被阻止", "fallback_b": "托管该视频的网站阻止了从这里下载。请通过此链接打开它，然后点 ⋮ 选择“下载”保存：", "fallback_open": "打开视频", "ok_t": "已下载 ✓", "ok_b": "视频已在您的设备上。", "about_h": "NOVA - 2026 年免费在线视频下载工具", "about_p1": "NOVA 是一款直接在浏览器中运行的免费工具，可让您在几秒内以原始格式保存 Pinterest 视频和直接视频链接，无需任何复杂步骤。", "about_p2": "无需账号：页面只与视频所在网站通信以获取画质，下载直接在您的设备上完成 - 您的链接和视频不会保存在我们这边。", "how_h": "如何在线下载视频", "step1_t": "复制视频链接", "step1_b": "打开 Pinterest，找到您想保存的视频，从地址栏复制完整的图钉链接。", "step2_t": "粘贴并选择画质", "step2_b": "在上方粘贴链接并点击“获取视频”。NOVA 会自动分析链接，并列出来源中可用的视频格式和画质选项。", "step3_t": "保存到设备", "step3_b": "选择适合您的画质 - 视频会在新标签页中打开；从 ⋮ 菜单选择“下载”即可保存到您的设备。", "fmt_h": "格式与画质", "fmt_b1": "来自 Pinterest：图钉本身可用的所有原始 MP4 画质，从最低到作者发布的最高分辨率 - 不增强、不放大。来自直接链接：视频按原始格式原样保存（MP4、WebM 或 MOV）。", "fmt_b2": "格式转换（如提取 MP3 音频）暂不可用，因为它需要真正的服务器端处理，而 NOVA 目前完全在您的设备上运行。", "feat_h": "为什么选择 NOVA？", "feat1_t": "所有可用的格式和画质", "feat1_b": "Pinterest 的所有原始 MP4 画质，与作者发布的完全一致；直接链接按原始格式保存。暂不支持 MP3 音频提取。", "feat2_t": "隐私", "feat2_b": "您的链接仅发送到视频站点以获取画质。无需账户、没有中间环节 - 下载直接在您的设备上完成。", "feat3_t": "GitHub", "feat3_b": "代码以 MIT 许可证发布在 GitHub 上 - 可自由阅读、修改和使用。", "feat4_t": "关于广告的说明", "feat4_b": "我们很快会添加少量安静的小广告，帮助我们维持 NOVA 的运营。感谢您的理解。", "plat_h": "支持的平台", "plat_pin": "Pinterest", "plat_pin_b": "公开图钉视频的所有原始画质。", "plat_direct": "直接链接", "plat_direct_b": "任何以 mp4、webm 或 mov 结尾的直接视频链接。", "feat5_t": "更多链接类型", "feat5_b": "支持 Pinterest 公开完整链接以及任何以 MP4、WebM 或 MOV 结尾的直接视频链接。pin.it 短链接不能直接粘贴使用：请先在浏览器中打开，再复制完整链接。", "feat6_t": "更简单、更安心", "feat6_b": "旨在让下载简单且保护隐私：没有弹窗和强制跳转，无需账号，没有拖慢您的步骤。", "plat_plan": "计划稍后支持（目前不可用）：", "plat_no": "当前浏览器版本暂不支持：YouTube、TikTok、Facebook、Instagram、X。这些平台禁止浏览器内直接下载，需要专用服务器 - 在平台真正可用之前，我们不会列出它。", "faq_h": "常见问题", "faq1_q": "为什么 pin.it 短链接不能直接使用？", "faq1_a": "pin.it 链接需要先打开：在浏览器中打开该链接，它会变成长链接 - 从地址栏复制后粘贴到这里。如果 Pinterest 不分享某些图钉的视频数据，即使使用完整链接也无法下载。", "faq2_q": "为什么看不到任何可下载的格式？", "faq2_a": "图钉可能已被删除、设为私密（保密），或内容是图片而非视频。请确认链接能打开公开视频后重试。", "faq3_q": "为什么视频在播放器中打开而不是下载文件？", "faq3_a": "Pinterest 会阻止外部网站的一键下载。点击画质，在新标签页中播放视频，然后从 ⋮ 菜单选择“下载”。", "faq4_q": "可以下载 MP3 或其他格式吗？", "faq4_a": "目前视频以原始格式保存（来自 Pinterest 的 MP4）。提取 MP3 音频或转换为其他格式需要转换服务器，NOVA 暂不支持。", "faq5_q": "能从 YouTube、TikTok、Facebook 或 Instagram 下载吗？", "faq5_a": "不能，当前浏览器版本不行：这些平台禁止浏览器内直接下载，需要专用服务器。NOVA 目前仅支持 Pinterest 和直接链接，在平台真正可用之前我们不会列出它。", "faq6_q": "可以下载播放列表或整个账号吗？", "faq6_a": "不可以，暂不支持。要保存多个视频，请分别复制并粘贴每个链接。", "faq7_q": "下载视频合法吗？", "faq7_a": "这取决于您所在国家/地区的法律以及您对内容的使用方式。请只下载您拥有或获授权保存的内容（视频或照片），并遵守各平台的条款。NOVA 不会仅因内容受版权保护而阻止下载，但使用责任由您自行承担。", "faq8_q": "为什么没有 1080p 或 4K 等高画质选项？", "faq8_a": "显示的画质取决于来源处的原始视频。NOVA 会列出实际存在的所有画质，但有些视频只有较低分辨率，因为作者就是这样发布的 - 我们绝不会放大或人为提升画质。", "faq9_q": "可以下载直播吗？", "faq9_a": "不可以。NOVA 只保存直播结束后已发布的视频；正在播出的直播无法下载为文件。", "faq10_q": "为什么下载的视频无法播放，或只有声音没有画面？", "faq10_a": "请从列表中选择其他画质重新下载。有些直接链接在源头就没有声音，有些播放器不支持所有格式——请尝试其他播放器（如 VLC）。", "footer1": "列出的画质为源站实际存在的画质 - 不做增强或放大。", "footer2": "请只下载您拥有或获授权保存的内容（视频或照片），并尊重内容权利人的权益。", "footer3": "GitHub", "rate_h": "为 NOVA 评分", "rate_note": "选择星数 - 您的评分只保留在您的设备上，不会发送到任何地方。", "rate_saved": "谢谢！您的评分已保存在您的设备上 ✦", "rate_pub": "想让评分公开吗？在 GitHub 上给我们一颗星：", "rate_gh": "在 GitHub 上点星", "pin_default": "Pinterest 视频", "err_short_t": "这个短链接", "err_short_b": "pin.it 链接需要先打开：在浏览器中打开该链接，它会变成长链接 - 从地址栏复制后粘贴到这里。如果 Pinterest 不分享某些图钉的视频数据，即使使用完整链接也无法下载。", "err_bad_t": "无法识别的链接", "err_bad_b": "请粘贴 Pinterest 图钉链接（如 pinterest.com/pin/…）或以 mp4 结尾的直接视频链接。", "err_notfound_t": "未找到图钉", "err_notfound_b": "请检查链接是否正确，以及图钉是公开的而非私密的。", "err_novideo_t": "找不到视频", "err_novideo_b": "这个图钉要么是图片而不是视频，要么是 Pinterest 没有与我们分享其视频数据，所以我们无法在这里提供下载。", "err_network_t": "连接问题", "err_network_b": "网络中断或 Pinterest 未响应。请重试。", "theme_title": "浅色 / 深色模式", "_dir": "ltr"}
};

let lang = LS.get('nova-lang') || 'ar';
const $ = (id) => document.getElementById(id);
const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.ar[k] || k;

// theme: dark (default) / light, remembered on this device
(() => {
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('nova-theme'); } catch (_) {}
  // default follows the visitor's own device/system theme; one tap switches directly
  if (saved === 'light' || (saved === null && window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches)) {
    root.classList.add('light');
  }
  const btn = $('theme-toggle');
  if (btn) btn.addEventListener('click', () => {
    root.classList.toggle('light');
    try { localStorage.setItem('nova-theme', root.classList.contains('light') ? 'light' : 'dark'); } catch (_) {}
  });
})();

function applyLang() {
  const d = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = d._dir;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); el.setAttribute('aria-label', el.title); });
  if (window.__syncLangUI) window.__syncLangUI();
  if (!NOVA_BACKEND && LS.get('nova-rating')) $('rate-note').textContent = t('rate_saved');
  document.title = 'N O V A — ' + t('h1');
}

const LANGS = ['ar', 'en', 'fr', 'es', 'ru', 'zh'];
const LANG_NAMES = { ar: 'عربي', en: 'English', fr: 'Français', es: 'Español', ru: 'Русский', zh: '中文' };
(function initLangSelect() {
  const btn = $('lang-btn'), menu = $('lang-menu'), cur = $('lang-current');
  if (!btn || !menu) return;
  LANGS.forEach((code) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'option');
    b.dataset.lang = code;
    b.textContent = LANG_NAMES[code];
    b.addEventListener('click', () => {
      lang = code;
      LS.set('nova-lang', lang);
      applyLang();
      closeMenu();
    });
    menu.appendChild(b);
  });
  function syncUI() {
    cur.textContent = LANG_NAMES[lang];
    menu.querySelectorAll('button').forEach((b) =>
      b.setAttribute('aria-selected', b.dataset.lang === lang ? 'true' : 'false'));
  }
  let open = false;
  function openMenu() { open = true; menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
  function closeMenu() { open = false; menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', (e) => { e.stopPropagation(); open ? closeMenu() : openMenu(); });
  document.addEventListener('click', (e) => {
    if (open && !menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) closeMenu(); });
  window.__syncLangUI = syncUI;
  syncUI();
})();


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

async function goBackend(s) {
  const btn = $('go');
  btn.disabled = true;
  btn.querySelector('span').textContent = t('going');
  try {
    renderResult(await backendExtract(s));
  } catch {
    showError('short');
  } finally {
    btn.disabled = false;
    btn.querySelector('span').textContent = t('go');
  }
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
  if (/pin\.it\//i.test(s)) {
    if (NOVA_BACKEND) return goBackend(s);
    return showError('short');
  }
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
    if (NOVA_BACKEND && e.message === 'novideo') {
      try {
        renderResult(await backendExtract(s));
        return;
      } catch { /* نكمل لرسالة الخطأ الأصلية */ }
    }
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
  LS.set('nova-rating', b.dataset.star);
  paintStars(Number(b.dataset.star));
  if (!NOVA_BACKEND) $('rate-note').textContent = t('rate_saved');
});
paintStars(Number(LS.get('nova-rating')) || 0);

// FAQ accordion exclusivity (reference behavior): opening one closes the others
document.querySelectorAll('details').forEach(function(d){
  d.addEventListener('toggle', function(){
    if (d.open) document.querySelectorAll('details[open]').forEach(function(o){ if (o !== d) o.open = false; });
  });
});

/* About mockup: demo progress animation up to 96% (visual preview only) */
/* عداد الزوار الحقيقي - يشتغل بس لما NOVA_BACKEND يتضبط */
function initCounters() {
  if (!NOVA_BACKEND) return;
  let cid = null;
  try {
    cid = LS.get('nova_cid');
    if (!cid) {
      cid = (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.floor(Math.random() * 16);
        return (c === 'x' ? r : (r & 3 | 8)).toString(16);
      }));
      LS.set('nova_cid', cid);
    }
  } catch { return; /* بدون تخزين محلي مش هنقدر نعدّ زيارة واحدة لكل جهاز - الأفضل نسكت */ }
  fetch(NOVA_BACKEND + '/api/visit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cid }) })
    .then(() => fetch(NOVA_BACKEND + '/api/stats/public'))
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => {
      const el = $('stats-line');
      if (el && d && typeof d.total === 'number') {
        el.textContent = t('stats_line').replace('{n}', String(d.total));
        el.hidden = false;
      }
    })
    .catch(() => { /* العداد اختياري - لو الـ backend مش متاح الصفحة تفضل سليمة */ });
}

document.addEventListener('DOMContentLoaded', function () {
  initCounters();
  var pct = document.querySelector('.mock-pct');
  var bar = document.querySelector('.mock-bar span');
  if (!pct || !bar) return;
  var START = 8, END = 96, DUR = 4200, HOLD = 2500;
  var t0 = null;
  function frame(ts) {
    if (t0 === null) t0 = ts;
    var t = (ts - t0) / DUR;
    if (t <= 1) {
      var e = 1 - Math.pow(1 - t, 3);
      var v = Math.round(START + (END - START) * e);
      pct.textContent = v + '%';
      bar.style.width = v + '%';
      requestAnimationFrame(frame);
    } else {
      pct.textContent = END + '%';
      bar.style.width = END + '%';
      setTimeout(function () { t0 = null; requestAnimationFrame(frame); }, HOLD);
    }
  }
  requestAnimationFrame(frame);
});

/* تقييم عام + تعليقات + إعجاب/عدم إعجاب - بتشتغل بس لما NOVA_BACKEND يتضبط (غير كده الصفحة زي ما هي) */
const SOCIAL_T = {
  ar: { rate_pub: 'تقييم الزوار', rate_none: 'لسه محدش قيّم', rate_sent: 'شكرًا! تقييمك اتحفظ على السيرفر', h: 'التعليقات', name: 'اسمك (اختياري)', ph: 'اكتب تعليقك', send: 'إرسال', none: 'لا توجد تعليقات بعد', fail: 'حصل خطأ، جرّب تاني', privacy: 'التعليقات والتقييمات والإعجابات بتتحفظ على السيرفر وتظهر للجميع. بنحفظ بصمة مُشفّرة لعنوان IP عشان صوت واحد لكل زائر، وبنعدّ الزيارات بمعرّف عشوائي محفوظ في متصفحك. روابط التحميل اللي بتلصقها بتوصل للسيرفر عشان يجيب الفيديو.' },
  en: { rate_pub: 'Visitor rating', rate_none: 'No ratings yet', rate_sent: 'Thanks! Your rating was saved on the server', h: 'Comments', name: 'Your name (optional)', ph: 'Write a comment', send: 'Send', none: 'No comments yet', fail: 'Something went wrong, try again', privacy: 'Comments, ratings and likes are stored on the server and visible to everyone. We store a hashed form of your IP address to allow one vote per visitor, and count visits with a random id kept in your browser. Links you paste are sent to the server to fetch the video.' },
};
function st(k) { const l = (typeof lang !== 'undefined' && SOCIAL_T[lang]) ? lang : 'en'; return SOCIAL_T[l][k]; }
function initSocial() {
  if (!NOVA_BACKEND) return;
  const SITE = '__nova_site__';
  const note = $('rate-note');
  const showAvg = (d) => { if (d && d.count) note.textContent = `${st('rate_pub')}: ${d.avg} / 5 (${d.count})`; else note.textContent = st('rate_none'); };
  fetch(NOVA_BACKEND + '/api/rating?url=' + SITE).then((r) => r.json()).then(showAvg).catch(() => {});
  $('rate-stars').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    fetch(NOVA_BACKEND + '/api/rating', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: SITE, stars: Number(b.dataset.star) }) })
      .then((r) => (r.ok ? r.json() : Promise.reject())).then((d) => { showAvg(d); note.title = st('rate_sent'); }).catch(() => { note.textContent = st('fail'); });
  });
  const sec = document.createElement('section');
  sec.className = 'panel'; sec.id = 'social-panel';
  sec.innerHTML = '<h2><span id="c-h"></span></h2>' +
    '<div class="stars-input"><button type="button" id="c-up" aria-label="like">👍 <span id="c-ups">0</span></button><button type="button" id="c-down" aria-label="dislike">👎 <span id="c-downs">0</span></button></div>' +
    '<div id="c-list"></div>' +
    '<input id="c-name" maxlength="40" autocomplete="off"><textarea id="c-text" maxlength="500" rows="3"></textarea>' +
    '<button type="button" id="c-send" class="quality primary"></button>' +
    '<p class="rate-note" id="c-priv"></p>';
  $('rate-panel').after(sec);
  const paint = () => {
    $('c-h').textContent = st('h'); $('c-name').placeholder = st('name'); $('c-text').placeholder = st('ph'); $('c-send').textContent = st('send'); $('c-priv').textContent = st('privacy');
  };
  paint();
  const load = (d) => {
    $('c-ups').textContent = d.likes; $('c-downs').textContent = d.dislikes;
    const box = $('c-list'); box.innerHTML = '';
    if (!d.comments.length) { const p = document.createElement('p'); p.className = 'rate-note'; p.textContent = st('none'); box.appendChild(p); }
    d.comments.forEach((c) => { const p = document.createElement('p'); p.className = 'rate-note'; const b = document.createElement('b'); b.textContent = c.name + ': '; p.appendChild(b); p.appendChild(document.createTextNode(c.text)); box.appendChild(p); });
  };
  const refresh = () => fetch(NOVA_BACKEND + '/api/comments').then((r) => r.json()).then(load).catch(() => {});
  refresh();
  [['c-up', 1], ['c-down', -1]].forEach(([id, v]) => $(id).addEventListener('click', () =>
    fetch(NOVA_BACKEND + '/api/react', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: v }) }).then((r) => r.json()).then(load).catch(() => {})));
  $('c-send').addEventListener('click', () => {
    const text = $('c-text').value.trim(); if (!text) return;
    fetch(NOVA_BACKEND + '/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: $('c-name').value, text }) })
      .then((r) => (r.ok ? ($('c-text').value = '', refresh()) : Promise.reject())).catch(() => { $('c-priv').textContent = st('fail'); });
  });
}
document.addEventListener('DOMContentLoaded', initSocial);
