
# Tamviet
My business

# Cấu trúc folders và files cho dự án
```js
my-app/
├── src/                        # (khuyến nghị cho dự án > nhỏ)
│   ├── app/                    # ← Tất cả routing + layouts ở đây
│   │   ├── layout.tsx          # Root layout (bắt buộc): <html>, <body>, global providers (Theme, QueryClient, Session...)
│   │   ├── page.tsx            # Trang chủ / (có thể redirect nếu logged in)
│   │   ├── globals.css
│   │   ├── favicon.ico
│   │   ├── (public)/           # Route group: public pages (không auth, URL sạch)
│   │   │   ├── layout.tsx      # Layout public: header đơn giản, footer, hero style
│   │   │   ├── page.tsx        # / (override root page nếu cần)
│   │   │   ├── about/
│   │   │   │   └── page.tsx    # /about
│   │   │   └── pricing/
│   │   │       └── page.tsx    # /pricing
│   │   ├── (auth)/             # Route group: auth pages (login/register, centered form, không sidebar/header chung)
│   │   │   ├── layout.tsx      # Auth layout: minimal, centered, no nav
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   └── (dashboard)/        # Route group: protected area (URL: /dashboard, /profile...)
│   │       ├── layout.tsx      # Dashboard layout chính: Sidebar + Topbar + Protected content wrapper
│   │       ├── page.tsx        # /dashboard (overview)
│   │       ├── profile/
│   │       │   └── page.tsx    # /profile
│   │       └── settings/
│   │           └── page.tsx    # /settings
│   ├── components/             # Shared UI: Button, Card, Modal, Header, Footer...
│   │   ├── ui/                 # Shadcn/Tailwind components
│   │   └── layout/             # Header, Sidebar, Footer...
│   ├── lib/                    # Utils, server actions, db, auth config...
│   └── hooks/                  # Custom hooks
├── public/
├── next.config.js
└── tailwind.config.ts
```