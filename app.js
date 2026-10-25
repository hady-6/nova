/* N O V A — حمّل فيديو من بنترست ولينكات مباشرة — كل المنطق بيشتغل على جهاز المستخدم */
'use strict';

const I18N = {
  ar: {
    _dir: 'rtl', _lang_btn: 'English',
    pill_badge: 'مفتوح المصدر', pill_text: 'نسخة 2026 · مجاني بالكامل',
    h1: 'حمّل فيديوهاتك بسهولة',
    sub: 'الصق الرابط واختار الجودة وحمّل',
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
    sub: 'Paste the link, pick your quality, and download.',
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
  fr: {"pill_badge": "Open source", "pill_text": "Édition 2026 · entièrement gratuit", "h1": "Téléchargez vos vidéos facilement", "sub": "Collez le lien, choisissez la qualité et téléchargez.", "url_label": "Lien de la vidéo", "ph": "https://www.pinterest.com/pin/…", "paste_title": "Coller", "go": "Obtenir la vidéo", "going": "Récupération…", "chip_free": "Gratuit", "chip_nolimits": "Sans compte", "chip_fast": "Rapide", "chip_private": "Privé", "chip_oss": "Open source", "choose_quality": "Choisir la qualité", "howto_save_t": "Comment l'enregistrer", "howto_save_b": "Touchez une qualité et la vidéo s'ouvre seule dans un nouvel onglet. Lancez-la, puis choisissez « Télécharger » dans le menu ⋮ pour l'enregistrer. Pinterest bloque les téléchargements en un geste depuis les sites externes.", "ready_t": "Prête à télécharger", "dl_btn": "Télécharger la vidéo", "fallback_t": "Téléchargement direct bloqué", "fallback_b": "Le site hébergeant cette vidéo bloque les téléchargements depuis ici. Ouvrez-la depuis ce lien et enregistrez-la via ⋮ puis « Télécharger » :", "fallback_open": "Ouvrir la vidéo", "ok_t": "Téléchargée ✓", "ok_b": "La vidéo est sur votre appareil.", "about_h": "NOVA - un téléchargeur de vidéos gratuit et open source", "about_p1": "NOVA est un outil simple qui fonctionne entièrement dans votre navigateur : collez un lien de pin Pinterest ou un lien vidéo direct, voyez toutes les qualités réellement disponibles à la source, choisissez-en une et téléchargez.", "about_p2": "Pas de comptes, pas de pubs, rien stocké de notre côté : la page ne dialogue qu'avec le site d'origine de la vidéo, et le téléchargement se fait sur votre appareil.", "how_h": "Comment télécharger", "step1_t": "Copiez le lien de la vidéo", "step1_b": "Ouvrez Pinterest, trouvez le pin contenant la vidéo et copiez son lien complet depuis la barre d'adresse.", "step2_t": "Collez-le et choisissez une qualité", "step2_b": "Collez le lien ci-dessus et touchez « Obtenir la vidéo ». NOVA liste toutes les qualités réellement présentes dans la vidéo originale.", "step3_t": "Enregistrez-la sur votre appareil", "step3_b": "Touchez la qualité voulue - la vidéo s'ouvre dans un nouvel onglet, puis choisissez « Télécharger » dans le menu ⋮.", "fmt_h": "Formats et qualité", "fmt_b1": "Depuis Pinterest : toutes les qualités MP4 originales disponibles dans la vidéo elle-même, sans fausse amélioration ni upscaling. Depuis les liens directs : la vidéo est enregistrée dans son format d'origine tel quel (mp4, webm ou mov).", "fmt_b2": "La conversion de format (comme l'extraction audio MP3) n'est pas encore disponible : elle demande un vrai transcodage côté serveur, et NOVA fonctionne actuellement entièrement sur votre appareil, sans serveur.", "feat_h": "Pourquoi NOVA ?", "feat1_t": "Qualités réelles", "feat1_b": "Les qualités listées sont celles réellement présentes à la source - pas de chiffres inventés, pas d'upscaling.", "feat2_t": "Confidentialité", "feat2_b": "Votre lien va uniquement à Pinterest (ou au site hébergeant la vidéo) pour récupérer les qualités. Pas de comptes, rien stocké par nous.", "feat3_t": "Open source", "feat3_b": "Le code est publié sur GitHub sous licence MIT - lisez-le, modifiez-le, utilisez-le librement.", "feat4_t": "Gratuit, sans pubs", "feat4_b": "Pas de popups, pas de comptes, pas d'étapes en plus.", "plat_h": "Plateformes prises en charge", "plat_pin": "Pinterest", "plat_pin_b": "Vidéos de pins publics dans toutes leurs qualités originales.", "plat_direct": "Liens directs", "plat_direct_b": "Tout lien vidéo direct se terminant par mp4, webm ou mov.", "plat_no": "Pas encore prises en charge : YouTube, Facebook, Instagram, X/Twitter - ces sites bloquent les téléchargements sans serveur dédié.", "faq_h": "FAQ", "faq1_q": "Pourquoi le lien court pin.it ne fonctionne pas ?", "faq1_a": "Les liens pin.it doivent d'abord être ouverts : ouvrez le lien dans votre navigateur, il devient le lien long - copiez-le depuis la barre d'adresse et collez-le ici.", "faq2_q": "Pourquoi la vidéo s'ouvre-t-elle dans un lecteur au lieu de se télécharger ?", "faq2_a": "Pinterest bloque les téléchargements en un geste depuis les sites externes. Touchez une qualité, lancez la vidéo dans le nouvel onglet, et choisissez « Télécharger » dans le menu ⋮.", "faq3_q": "Puis-je télécharger en MP3 ou d'autres formats ?", "faq3_a": "Pour l'instant la vidéo est enregistrée dans son format d'origine (MP4 depuis Pinterest). L'extraction audio MP3 ou la conversion demande un serveur de conversion et n'est pas encore disponible dans NOVA.", "faq4_q": "Est-ce que ça télécharge depuis YouTube, Facebook ou Instagram ?", "faq4_a": "Pas encore. Ces plateformes bloquent les téléchargements directs depuis le navigateur et demandent un serveur dédié. NOVA fonctionne actuellement avec Pinterest et les liens directs.", "faq5_q": "Le téléchargement est-il légal ?", "faq5_a": "Ne téléchargez que du contenu que vous possédez ou avez la permission d'enregistrer, et respectez les lois locales et les conditions de chaque plateforme. Les droits du contenu appartiennent à leurs détenteurs.", "footer1": "Les qualités listées sont celles réellement présentes à la source - sans amélioration ni upscaling.", "footer2": "Ne téléchargez que du contenu que vous possédez ou avez la permission d'enregistrer, et respectez les droits des détenteurs de contenu.", "footer3": "Open source sous licence MIT", "rate_h": "Notez NOVA", "rate_note": "Choisissez un nombre d'étoiles - votre note reste uniquement sur votre appareil, jamais envoyée.", "rate_saved": "Merci ! Votre note est enregistrée sur votre appareil ✦", "rate_pub": "Vous voulez une note publique ? Donnez-nous une étoile sur GitHub :", "rate_gh": "Étoile sur GitHub", "pin_default": "Vidéo Pinterest", "err_short_t": "Ce lien court", "err_short_b": "Les liens pin.it doivent d'abord être ouverts : ouvrez le lien dans votre navigateur, il devient le lien long - copiez-le depuis la barre d'adresse et collez-le ici.", "err_bad_t": "Lien peu clair", "err_bad_b": "Collez un lien de pin Pinterest (comme pinterest.com/pin/…) ou un lien vidéo direct se terminant par mp4.", "err_notfound_t": "Pin introuvable", "err_notfound_b": "Vérifiez que le lien est correct et que le pin est public, pas secret.", "err_novideo_t": "Ce n'est pas une vidéo", "err_novideo_b": "Ce pin est une image, pas une vidéo - rien à télécharger comme vidéo.", "err_network_t": "Problème de connexion", "err_network_b": "Le réseau a coupé ou Pinterest n'a pas répondu. Réessayez.", "_dir": "ltr"},
  es: {"pill_badge": "Código abierto", "pill_text": "Edición 2026 · completamente gratis", "h1": "Descarga videos con facilidad", "sub": "Pega el enlace, elige la calidad y descarga.", "url_label": "Enlace del video", "ph": "https://www.pinterest.com/pin/…", "paste_title": "Pegar", "go": "Obtener video", "going": "Obteniendo…", "chip_free": "Gratis", "chip_nolimits": "Sin cuenta", "chip_fast": "Rápido", "chip_private": "Privado", "chip_oss": "Código abierto", "choose_quality": "Elige la calidad", "howto_save_t": "Cómo guardarlo", "howto_save_b": "Toca una calidad y el video se abre solo en una pestaña nueva. Reprodúcelo y luego elige «Descargar» en el menú ⋮ para guardarlo. Pinterest bloquea las descargas de un toque desde sitios externos.", "ready_t": "Listo para descargar", "dl_btn": "Descargar video", "fallback_t": "Descarga directa bloqueada", "fallback_b": "El sitio que aloja este video bloquea las descargas desde aquí. Ábrelo desde este enlace y guárdalo con ⋮ y luego «Descargar»:", "fallback_open": "Abrir video", "ok_t": "Descargado ✓", "ok_b": "El video está en tu dispositivo.", "about_h": "NOVA - un descargador de videos gratuito y de código abierto", "about_p1": "NOVA es una herramienta simple que funciona por completo en tu navegador: pega un enlace de pin de Pinterest o un enlace directo de video, mira todas las calidades realmente disponibles en la fuente, elige una y descarga.", "about_p2": "Sin cuentas, sin anuncios, nada guardado de nuestro lado: la página solo habla con el sitio de origen del video, y la descarga ocurre en tu dispositivo.", "how_h": "Cómo descargar", "step1_t": "Copia el enlace del video", "step1_b": "Abre Pinterest, encuentra el pin con el video y copia su enlace completo desde la barra de direcciones.", "step2_t": "Pégalo y elige una calidad", "step2_b": "Pega el enlace arriba y toca «Obtener video». NOVA enumera todas las calidades que realmente existen en el video original.", "step3_t": "Guárdalo en tu dispositivo", "step3_b": "Toca la calidad que quieras - el video se abre en una pestaña nueva, luego elige «Descargar» en el menú ⋮.", "fmt_h": "Formatos y calidad", "fmt_b1": "Desde Pinterest: todas las calidades MP4 originales disponibles en el video mismo, sin mejora falsa ni reescalado. Desde enlaces directos: el video se guarda en su formato original tal cual (mp4, webm o mov).", "fmt_b2": "La conversión de formato (como extraer audio MP3) aún no está disponible: necesita transcodificación real en un servidor, y NOVA actualmente funciona por completo en tu dispositivo, sin servidor.", "feat_h": "¿Por qué NOVA?", "feat1_t": "Calidades reales", "feat1_b": "Las calidades listadas son las realmente presentes en la fuente - sin números falsos ni reescalado.", "feat2_t": "Privacidad", "feat2_b": "Tu enlace va solo a Pinterest (o al sitio que aloja el video) para obtener las calidades. Sin cuentas, nada almacenado por nosotros.", "feat3_t": "Código abierto", "feat3_b": "El código se publica en GitHub bajo licencia MIT - léelo, modifícalo, úsalo libremente.", "feat4_t": "Gratis, sin anuncios", "feat4_b": "Sin ventanas emergentes, sin cuentas, sin pasos extra.", "plat_h": "Plataformas compatibles", "plat_pin": "Pinterest", "plat_pin_b": "Videos de pines públicos en todas sus calidades originales.", "plat_direct": "Enlaces directos", "plat_direct_b": "Cualquier enlace directo de video que termine en mp4, webm o mov.", "plat_no": "Aún no compatibles: YouTube, Facebook, Instagram, X/Twitter - esos sitios bloquean las descargas sin un servidor dedicado.", "faq_h": "Preguntas frecuentes", "faq1_q": "¿Por qué no funciona el enlace corto pin.it?", "faq1_a": "Los enlaces pin.it deben abrirse primero: abre el enlace en tu navegador, se convierte en el enlace largo - cópialo de la barra de direcciones y pégalo aquí.", "faq2_q": "¿Por qué el video se abre en un reproductor en vez de descargarse?", "faq2_a": "Pinterest bloquea las descargas de un toque desde sitios externos. Toca una calidad, reproduce el video en la pestaña nueva y elige «Descargar» en el menú ⋮.", "faq3_q": "¿Puedo descargar MP3 u otros formatos?", "faq3_a": "Por ahora el video se guarda en su formato original (MP4 desde Pinterest). Extraer audio MP3 o convertir formatos necesita un servidor de conversión y aún no está disponible en NOVA.", "faq4_q": "¿Descarga de YouTube, Facebook o Instagram?", "faq4_a": "Todavía no. Esas plataformas bloquean las descargas directas del navegador y necesitan un servidor dedicado. NOVA funciona actualmente con Pinterest y enlaces directos.", "faq5_q": "¿Es legal descargar?", "faq5_a": "Descarga solo contenido que poseas o tengas permiso de guardar, y respeta las leyes locales y los términos de cada plataforma. Los derechos del contenido pertenecen a sus dueños.", "footer1": "Las calidades listadas son las realmente presentes en la fuente - sin mejora ni reescalado.", "footer2": "Descarga solo contenido que poseas o tengas permiso de guardar, y respeta los derechos de los dueños del contenido.", "footer3": "Código abierto bajo licencia MIT", "rate_h": "Califica NOVA", "rate_note": "Elige un número de estrellas - tu calificación se queda solo en tu dispositivo, nunca se envía.", "rate_saved": "¡Gracias! Tu calificación se guardó en tu dispositivo ✦", "rate_pub": "¿Quieres que tu calificación sea pública? Danos una estrella en GitHub:", "rate_gh": "Estrella en GitHub", "pin_default": "Video de Pinterest", "err_short_t": "Ese enlace corto", "err_short_b": "Los enlaces pin.it deben abrirse primero: abre el enlace en tu navegador, se convierte en el enlace largo - cópialo de la barra de direcciones y pégalo aquí.", "err_bad_t": "Enlace poco claro", "err_bad_b": "Pega un enlace de pin de Pinterest (como pinterest.com/pin/…) o un enlace directo de video que termine en mp4.", "err_notfound_t": "Pin no encontrado", "err_notfound_b": "Verifica que el enlace sea correcto y que el pin sea público, no secreto.", "err_novideo_t": "Eso no es un video", "err_novideo_b": "Este pin es una imagen, no un video - no hay nada que descargar como video.", "err_network_t": "Problema de conexión", "err_network_b": "La red se cortó o Pinterest no respondió. Inténtalo de nuevo.", "_dir": "ltr"},
  ru: {"pill_badge": "Открытый код", "pill_text": "Версия 2026 · полностью бесплатно", "h1": "Скачивайте видео легко", "sub": "Вставьте ссылку, выберите качество и скачайте.", "url_label": "Ссылка на видео", "ph": "https://www.pinterest.com/pin/…", "paste_title": "Вставить", "go": "Скачать видео", "going": "Загрузка…", "chip_free": "Бесплатно", "chip_nolimits": "Без аккаунта", "chip_fast": "Быстро", "chip_private": "Приватно", "chip_oss": "Открытый код", "choose_quality": "Выберите качество", "howto_save_t": "Как сохранить", "howto_save_b": "Нажмите на качество, и видео откроется в новой вкладке. Запустите его, затем выберите «Скачать» в меню ⋮, чтобы сохранить. Pinterest блокирует скачивание в одно нажатие с внешних сайтов.", "ready_t": "Готово к скачиванию", "dl_btn": "Скачать видео", "fallback_t": "Прямое скачивание заблокировано", "fallback_b": "Сайт, на котором размещено это видео, блокирует скачивание отсюда. Откройте его по этой ссылке и сохраните через ⋮, затем «Скачать»:", "fallback_open": "Открыть видео", "ok_t": "Скачано ✓", "ok_b": "Видео на вашем устройстве.", "about_h": "NOVA - бесплатный загрузчик видео с открытым кодом", "about_p1": "NOVA - простой инструмент, который работает полностью в вашем браузере: вставьте ссылку на пин Pinterest или прямую ссылку на видео, посмотрите все качества, реально доступные у источника, выберите одно и скачайте.", "about_p2": "Без аккаунтов, без рекламы, ничего не хранится на нашей стороне: страница общается только с сайтом-источником видео, а скачивание происходит на вашем устройстве.", "how_h": "Как скачать", "step1_t": "Скопируйте ссылку на видео", "step1_b": "Откройте Pinterest, найдите пин с видео и скопируйте его полную ссылку из адресной строки.", "step2_t": "Вставьте её и выберите качество", "step2_b": "Вставьте ссылку выше и нажмите «Скачать видео». NOVA покажет все качества, реально существующие в исходном видео.", "step3_t": "Сохраните на устройство", "step3_b": "Нажмите на нужное качество - видео откроется в новой вкладке, затем выберите «Скачать» в меню ⋮.", "fmt_h": "Форматы и качество", "fmt_b1": "С Pinterest: все исходные качества MP4, доступные в самом видео, без фальшивого улучшения или апскейла. По прямым ссылкам: видео сохраняется в исходном формате как есть (mp4, webm или mov).", "fmt_b2": "Конвертация форматов (например, извлечение аудио MP3) пока недоступна: для неё нужен настоящий серверный транскодинг, а NOVA сейчас работает полностью на вашем устройстве, без сервера.", "feat_h": "Почему NOVA?", "feat1_t": "Реальные качества", "feat1_b": "В списке только те качества, которые реально есть у источника - без выдуманных цифр и апскейла.", "feat2_t": "Приватность", "feat2_b": "Ваша ссылка уходит только в Pinterest (или на сайт, где размещено видео), чтобы получить качества. Без аккаунтов, мы ничего не храним.", "feat3_t": "Открытый код", "feat3_b": "Код публикуется на GitHub под лицензией MIT - читайте, изменяйте, используйте свободно.", "feat4_t": "Бесплатно, без рекламы", "feat4_b": "Без всплывающих окон, без аккаунтов, без лишних шагов.", "plat_h": "Поддерживаемые платформы", "plat_pin": "Pinterest", "plat_pin_b": "Видео из публичных пинов во всех исходных качествах.", "plat_direct": "Прямые ссылки", "plat_direct_b": "Любая прямая ссылка на видео, заканчивающаяся на mp4, webm или mov.", "plat_no": "Пока не поддерживаются: YouTube, Facebook, Instagram, X/Twitter - эти сайты блокируют скачивание без выделенного сервера.", "faq_h": "Частые вопросы", "faq1_q": "Почему не работает короткая ссылка pin.it?", "faq1_a": "Ссылки pin.it нужно сначала открыть: откройте ссылку в браузере, она превратится в длинную - скопируйте её из адресной строки и вставьте сюда.", "faq2_q": "Почему видео открывается в плеере вместо скачивания?", "faq2_a": "Pinterest блокирует скачивание в одно нажатие с внешних сайтов. Нажмите на качество, запустите видео в новой вкладке и выберите «Скачать» в меню ⋮.", "faq3_q": "Можно ли скачать MP3 или другие форматы?", "faq3_a": "Пока видео сохраняется в исходном формате (MP4 с Pinterest). Извлечение аудио MP3 или конвертация требуют сервера конвертации и пока недоступны в NOVA.", "faq4_q": "Скачивает ли он с YouTube, Facebook или Instagram?", "faq4_a": "Пока нет. Эти платформы блокируют прямое скачивание из браузера и требуют выделенного сервера. NOVA сейчас работает с Pinterest и прямыми ссылками.", "faq5_q": "Законно ли скачивание?", "faq5_a": "Скачивайте только контент, которым владеете или имеете разрешение сохранить, и соблюдайте местные законы и правила каждой платформы. Права на контент принадлежат их владельцам.", "footer1": "Указанные качества - те, что реально есть у источника, без улучшения и апскейла.", "footer2": "Скачивайте только контент, которым владеете или имеете разрешение сохранить, и уважайте права правообладателей.", "footer3": "Открытый код под лицензией MIT", "rate_h": "Оцените NOVA", "rate_note": "Выберите количество звёзд - ваша оценка остаётся только на вашем устройстве и никуда не отправляется.", "rate_saved": "Спасибо! Ваша оценка сохранена на вашем устройстве ✦", "rate_pub": "Хотите публичную оценку? Поставьте нам звезду на GitHub:", "rate_gh": "Звезда на GitHub", "pin_default": "Видео Pinterest", "err_short_t": "Эта короткая ссылка", "err_short_b": "Ссылки pin.it нужно сначала открыть: откройте ссылку в браузере, она превратится в длинную - скопируйте её из адресной строки и вставьте сюда.", "err_bad_t": "Непонятная ссылка", "err_bad_b": "Вставьте ссылку на пин Pinterest (вроде pinterest.com/pin/…) или прямую ссылку на видео, заканчивающуюся на mp4.", "err_notfound_t": "Пин не найден", "err_notfound_b": "Проверьте, что ссылка верна и пин публичный, а не секретный.", "err_novideo_t": "Это не видео", "err_novideo_b": "Этот пин - изображение, а не видео, скачивать как видео нечего.", "err_network_t": "Проблема с соединением", "err_network_b": "Сеть прервалась или Pinterest не ответил. Попробуйте снова.", "_dir": "ltr"},
  zh: {"pill_badge": "开源", "pill_text": "2026 版 · 完全免费", "h1": "轻松下载视频", "sub": "粘贴链接，选择画质，即可下载。", "url_label": "视频链接", "ph": "https://www.pinterest.com/pin/…", "paste_title": "粘贴", "go": "获取视频", "going": "获取中…", "chip_free": "免费", "chip_nolimits": "无需账号", "chip_fast": "快速", "chip_private": "私密", "chip_oss": "开源", "choose_quality": "选择画质", "howto_save_t": "如何保存", "howto_save_b": "点击画质，视频会在新标签页中单独打开。播放它，然后从 ⋮ 菜单选择“下载”即可保存。Pinterest 会阻止外部网站的一键下载。", "ready_t": "可以下载了", "dl_btn": "下载视频", "fallback_t": "直接下载被阻止", "fallback_b": "托管该视频的网站阻止了从这里下载。请通过此链接打开它，然后点 ⋮ 选择“下载”保存：", "fallback_open": "打开视频", "ok_t": "已下载 ✓", "ok_b": "视频已在您的设备上。", "about_h": "NOVA - 免费开源的视频下载器", "about_p1": "NOVA 是一个完全在您浏览器中运行的简单工具：粘贴 Pinterest 图钉链接或直接视频链接，查看源站实际可用的所有画质，选择一个并下载。", "about_p2": "无需账号、没有广告、我们这边不存储任何内容：页面只与视频来源网站通信，下载在您的设备上完成。", "how_h": "如何下载", "step1_t": "复制视频链接", "step1_b": "打开 Pinterest，找到包含视频的图钉，从地址栏复制完整链接。", "step2_t": "粘贴并选择画质", "step2_b": "在上方粘贴链接，点击“获取视频”。NOVA 会列出原视频实际存在的所有画质。", "step3_t": "保存到设备", "step3_b": "点击想要的画质 - 视频会在新标签页打开，然后从 ⋮ 菜单选择“下载”。", "fmt_h": "格式与画质", "fmt_b1": "来自 Pinterest：视频本身所有可用的原始 MP4 画质，没有虚假增强或放大。直接链接：视频按原始格式原样保存（mp4、webm 或 mov）。", "fmt_b2": "格式转换（如提取 MP3 音频）暂不可用：它需要真正的服务器端转码，而 NOVA 目前完全在您的设备上运行，没有服务器。", "feat_h": "为什么选择 NOVA？", "feat1_t": "真实画质", "feat1_b": "列出的画质就是源站实际存在的画质 - 没有虚假数字，没有放大处理。", "feat2_t": "隐私", "feat2_b": "您的链接只会发送到 Pinterest（或视频所在网站）以获取画质。无需账号，我们不存储任何内容。", "feat3_t": "开源", "feat3_b": "代码以 MIT 许可证发布在 GitHub 上 - 自由阅读、修改和使用。", "feat4_t": "免费无广告", "feat4_b": "没有弹窗、无需账号、没有多余步骤。", "plat_h": "支持的平台", "plat_pin": "Pinterest", "plat_pin_b": "公开图钉视频的所有原始画质。", "plat_direct": "直接链接", "plat_direct_b": "任何以 mp4、webm 或 mov 结尾的直接视频链接。", "plat_no": "暂不支持：YouTube、Facebook、Instagram、X/Twitter - 这些网站会阻止没有专用服务器的下载。", "faq_h": "常见问题", "faq1_q": "为什么 pin.it 短链接不能用？", "faq1_a": "pin.it 链接需要先打开：在浏览器中打开该链接，它会变成长链接 - 从地址栏复制后粘贴到这里。", "faq2_q": "为什么视频在播放器中打开而不是下载？", "faq2_a": "Pinterest 会阻止外部网站的一键下载。点击画质，在新标签页中播放视频，然后从 ⋮ 菜单选择“下载”。", "faq3_q": "可以下载 MP3 或其他格式吗？", "faq3_a": "目前视频以原始格式保存（来自 Pinterest 的 MP4）。提取 MP3 音频或转换格式需要转换服务器，NOVA 暂不支持。", "faq4_q": "支持 YouTube、Facebook 或 Instagram 吗？", "faq4_a": "暂时不支持。这些平台会阻止浏览器直接下载，需要专用服务器。NOVA 目前支持 Pinterest 和直接链接。", "faq5_q": "下载合法吗？", "faq5_a": "请只下载您拥有或有权保存的内容，并遵守当地法律和各平台条款。内容权利归其所有者。", "footer1": "列出的画质为源站实际存在的画质 - 不做增强或放大。", "footer2": "请只下载您拥有或有权保存的内容，并尊重内容所有者的权利。", "footer3": "基于 MIT 许可证开源", "rate_h": "为 NOVA 评分", "rate_note": "选择星数 - 您的评分只保留在您的设备上，不会发送到任何地方。", "rate_saved": "谢谢！您的评分已保存在您的设备上 ✦", "rate_pub": "想让评分公开吗？在 GitHub 上给我们一颗星：", "rate_gh": "在 GitHub 上点星", "pin_default": "Pinterest 视频", "err_short_t": "这个短链接", "err_short_b": "pin.it 链接需要先打开：在浏览器中打开该链接，它会变成长链接 - 从地址栏复制后粘贴到这里。", "err_bad_t": "无法识别的链接", "err_bad_b": "请粘贴 Pinterest 图钉链接（如 pinterest.com/pin/…）或以 mp4 结尾的直接视频链接。", "err_notfound_t": "未找到图钉", "err_notfound_b": "请检查链接是否正确，以及图钉是公开的而非私密的。", "err_novideo_t": "这不是视频", "err_novideo_b": "这个图钉是图片而不是视频 - 没有可作为视频下载的内容。", "err_network_t": "连接问题", "err_network_b": "网络中断或 Pinterest 未响应。请重试。", "_dir": "ltr"}
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
  const sel = $('lang-select');
  if (sel && sel.value !== lang) sel.value = lang;
  if (localStorage.getItem('nova-rating')) $('rate-note').textContent = t('rate_saved');
  document.title = 'N O V A — ' + t('h1');
}

const LANGS = ['ar', 'en', 'fr', 'es', 'ru', 'zh'];
const LANG_NAMES = { ar: 'عربي', en: 'English', fr: 'Français', es: 'Español', ru: 'Русский', zh: '中文' };
(function initLangSelect() {
  const sel = $('lang-select');
  LANGS.forEach((code) => {
    const o = document.createElement('option');
    o.value = code;
    o.textContent = LANG_NAMES[code];
    sel.appendChild(o);
  });
  sel.value = lang;
  sel.addEventListener('change', () => {
    lang = sel.value;
    localStorage.setItem('nova-lang', lang);
    applyLang();
  });
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
