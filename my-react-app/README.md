# Insurance Mini App - Alipay

تطبيق Mini App لإصدار وثيقة التأمين عبر Alipay.

## الميزات

- تسجيل الدخول عبر Alipay Mini App API
- إنشاء عرض سعر للتأمين
- إدارة المستفيدين
- معالجة الدفع
- عرض نتيجة إصدار الوثيقة

## التقنيات المستخدمة

- React 19
- TypeScript
- Vite
- React Router
- Zustand (State Management)
- React Hook Form + Zod (Form Validation)
- Tailwind CSS
- shadcn/ui
- Lucide React (Icons)
- Axios (HTTP Client)
- TanStack Query (React Query)

## التثبيت

```bash
npm install
```

## التشغيل

```bash
npm run dev
```

## البناء للإنتاج

```bash
npm run build
```

## متغيرات البيئة

أنشئ ملف `.env` وانسخ محتوى `.env.example`:

```
VITE_API_BASE_URL=https://api.example.com
```

## Alipay Mini App API

التطبيق يستخدم `my.getAuthCode` من Alipay Mini App API للحصول على رمز التفويض.

### مثال الاستخدام:

```typescript
window.my.getAuthCode({
  scopes: ['auth_base', 'auth_user'],
  success: (res) => {
    console.log(res.authCode);
  },
  fail: (err) => {
    console.error(err);
  }
});
```

## هيكل المشروع

```
src/
├── app/              # إعدادات التطبيق
│   ├── routes/       # إعدادات المسارات
│   ├── layout/       # تخطيط الصفحات
│   └── providers/    # Providers
├── pages/            # الصفحات
│   ├── login/        # صفحة تسجيل الدخول
│   ├── quotation/    # صفحة عرض السعر
│   ├── beneficiaries/# صفحة المستفيدين
│   ├── payment/      # صفحة الدفع
│   └── policy-result/# صفحة نتيجة الوثيقة
├── components/       # المكونات
│   ├── ui/           # مكونات UI الأساسية
│   ├── forms/        # مكونات النماذج
│   └── tables/       # مكونات الجداول
├── services/         # الخدمات
│   ├── auth.service.ts
│   ├── policy.service.ts
│   └── lookup.service.ts
├── store/            # Zustand Stores
│   ├── auth.store.ts
│   └── policy.store.ts
├── types/            # TypeScript Types
│   └── isa.ts
├── hooks/            # Custom Hooks
└── utils/            # Utility Functions
```

## الألوان

التطبيق يستخدم نظام ألوان مخصص مع متغيرات CSS:

- `--main-sv-color`: #448135 (أخضر داكن)
- `--base-sv-color`: #59b947 (أخضر)
- `--secondary-sv-color`: #e1e2e4 (بيج فاتح)

## الترخيص

MIT
