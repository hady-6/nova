# NOVA - النسخة الخاصة (موقع + سيرفر)

نسخة نوفا الكاملة للاستضافة الذاتية: واجهة الموقع (٣١ لغة، منها العربي والإنجليزي) + سيرفر التحميل (بنترست، تيك توك، إكس، ولينكات مباشرة + تحويل MP3/GIF) + بوابة دخول بكلمة سر تحمي كل الصفحات.

## أهم خطوة قبل أي حاجة: كلمة السر

الموقع **مش هيفتح أبدًا** من غير ما تضبط متغير البيئة:

```
NOVA_TRIAL_KEY = <كلمة سر قوية من اختيارك>
```

- من غيرها، الزائر يشوف صفحة «الإعداد ناقص» بس - الموقع مقفول بالكامل (ده مقصود للحماية).
- كلمة السر دي هي اللي هتدخل بها الموقع. متكتبهاش في أي لينك ولا تشاركها علنًا.

## إعدادات الاستضافة (أي خدمة Docker)

- **Build:** من الـ Dockerfile الموجود (مفيش أوامر خاصة).
- **Port:** السيرفر بيقرأ المنفذ من متغير `PORT` تلقائيًا (لو مش موجود يشتغل على 8000).
- **Health check (اختياري):** `/api/health` - بيرد 200 من غير تسجيل دخول (صلاحية السيرفر بس، مفيهاش بيانات)
- **Environment variables:**
  - `NOVA_TRIAL_KEY` (إجباري) - كلمة سر دخول الموقع.
  - `NOVA_TRUST_PROXY=1` (اختياري) - فعّلها **بس** لو السيرفر ورا بروكسي موثوق بيمرّر هيدر `X-Forwarded-For` (زي Railway/Render). من غيرها ورا بروكسي، كل الزوار هياخدوا IP البروكسي: حدود الاستخدام هتتحسب على الكل كأنهم شخص واحد، وتقييمات اللينكات هتتشارك صوت واحد لكل زوار نفس الشبكة. لو مش ورا بروكسي موثوق متفعلهاش (الهيدر ممكن يتزوّر).
  - `NOVA_RATINGS_PATH` (اختياري) - مكان ملف تقييمات اللينكات (افتراضي `nova_ratings.json` جنب التطبيق). التقييمات بتتخزن بمعرّف مجهول (IP متشفّر) من غير حسابات، والصوت قابل للتغيير من نفس الزائر. الكتابة ذرّية (lock + os.replace). على استضافة بتخزين مؤقت (ephemeral) ظبط المسار على volume دائم ولا التقييمات هتتراجع مع كل إعادة نشر.

## تشغيل محلي بدوكر

```
docker build -t nova .
docker run -e NOVA_TRIAL_KEY=اكتب-كلمة-سر-قوية -e PORT=8000 -p 8000:8000 nova
```

وبعدين افتح http://localhost:8000 وسجّل دخول بكلمة السر.

## بدون دوكر (Python 3.12 + ffmpeg)

```
pip install -r requirements.txt
NOVA_TRIAL_KEY=اكتب-كلمة-سر-قوية PORT=8000 uvicorn app:app --host 0.0.0.0 --port 8000
```

## ملاحظات

- بعد تسجيل الدخول، الجلسة بتفضل شغالة ٧ أيام على نفس الجهاز.
- تحديث الموقع = استبدال الملفات وإعادة النشر (redeploy).
- الحزمة دي مفيهاش أي كلمات سر ولا مفاتيح - كلمة السر بتتحط عندك في إعدادات الاستضافة بس.

---

# NOVA - private build (site + server)

Self-hostable NOVA: 31-language site (incl. AR/EN/FR/ES/RU/zh-CN) + download server (Pinterest, TikTok, X, direct links + MP3/GIF conversion) + password gate on every route.

**Required first:** set env var `NOVA_TRIAL_KEY` to a strong password of your choice. Without it the app intentionally shows only a setup page (fail-closed). Build from the included Dockerfile; the server reads `PORT` (default 8000); optional health check at `/api/health` (unauthenticated 200, liveness only). This package contains no secrets.
