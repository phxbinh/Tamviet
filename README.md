
# Tamviet
My business

### Cấu trúc folders và files cho dự án
```plaintext
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

### Cấu trúc để export các logic & components
```plaintext
features/products/

components/
 ├ ProductCard.tsx
 ├ ProductList.tsx
 └ ProductForm.tsx

actions/
 ├ createProduct.ts
 ├ updateProduct.ts
 └ deleteProduct.ts

queries/
 ├ getProducts.ts
 └ getProductById.ts

validators/
 └ productSchema.ts

types/
 └ product.type.ts

index.ts
internal.ts
```  
#### index.ts -> export cho bên ngoài features/products sử dụng
```ts
/* Trong index.ts */
// features/products/index.ts
// ✅ Cách 1. export những cái được chọn
export { ProductCard } from './components/ProductCard'
export { getProducts } from './queries/getProducts'
export { createProduct } from './actions/createProduct'

// ❌ Cách 2: export tất cả
export * from './components/ProductCard'
export * from './queries/getProducts'
export * from './actions/createProduct'

/* Cách gọi các export ở index.ts */
import { getProducts, ProductCard } from '@/features/products'
```

#### internal.ts -> export cho nội bộ features/products sử dụng
```ts
/* Trong internal.ts */
// features/products/internal.ts
export { formatProduct } from './utils/formatProduct'
export { productSchema } from './validators/productSchema'

/* Cách gọi các export ở internal.ts */
import { productSchema } from '../internal'
```


#### Cấu trúc api cho upload ảnh
```plaintext
GET    /api/products/variants/[variantId]/images
POST   /api/products/images
DELETE /api/products/images/[id]
PATCH  /api/products/images/[id]/thumbnail
PATCH  /api/products/images/reorder
POST   /api/products/images/precheck
```

#### Cấu trúc dự án Next.js --) Tham khảo
```plaintext
my-nextjs-app/
├── public/              # Chứa assets tĩnh (images, fonts, robots.txt...)
├── src/                 # Toàn bộ mã nguồn nằm ở đây (Khuyên dùng)
│   ├── app/             # App Router (File-system routing)
│   │   ├── (auth)/      # Route groups (ví dụ: login, register)
│   │   ├── (dashboard)/ # Route groups cho admin/user panel
│   │   ├── api/         # Các API routes (Backend-side)
│   │   ├── layout.tsx   # Root layout dùng chung
│   │   └── page.tsx     # Trang chủ
│   ├── components/      # Các UI Components dùng chung
│   │   ├── ui/          # Nguyên tử (button, input - shadcn/ui style)
│   │   ├── forms/       # Các logic liên quan đến form
│   │   └── shared/      # Navbar, Footer, Sidebar
│   ├── hooks/           # Custom React hooks (useLocalStorage, useAuth...)
│   ├── lib/             # Cấu hình thư viện bên thứ 3 (prisma, axios, utils)
│   ├── services/        # Nơi gọi API (Fetch, React Query) hoặc logic nghiệp vụ
│   ├── store/           # Quản lý state (Zustand, Redux, Jotai)
│   ├── types/           # Định nghĩa TypeScript interfaces/types
│   └── constants/       # Các biến hằng số, config màu sắc, menu items
├── tailwind.config.ts   # Cấu hình Tailwind CSS
├── next.config.mjs      # Cấu hình Next.js
└── package.json
```

#### Cấu trúc folders cho Global Local Shared
```plaintext
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".", 
    "paths": {
      /* 1. Tầng Giao diện & Hệ thống (Bất biến) */
      "@/*": ["./src/*"],
      "@ui/*": ["./src/components/ui/*"],
      "@shared/*": ["./src/components/shared/*"],
      
      /* 2. Tầng Logic & Hạ tầng (Cẩn thận khi sửa) */
      "@lib/*": ["./src/lib/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@types/*": ["./src/types/*"],
      "@const/*": ["./src/constants/*"],

      /* 3. Tầng Tính năng (Dành cho Colocation - Local) */
      /* Khi bạn làm việc ở route nào, bạn có thể gọi bí danh riêng cho nó */
      "@orders/*": ["./src/app/(dashboard)/orders/_components/*"],
      "@products/*": ["./src/app/(dashboard)/products/_components/*"],
      "@auth/*": ["./src/app/(auth)/_components/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

```ts
// Xem ở ProductCardSlug.tsx ở (public)/_homepage)
// Sử dụng toast
// Import component
import { useToastStore } from "@/store/useToastStore";

// Khai báo để sử dụng trong hàm
const { showToast } = useToastStore();

// Gọi ở handlerClick trong CTA
showToast(`Đã thêm sản phẩm thành công!`, "success");

```
  