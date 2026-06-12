# Danh sách Packages theo nhóm làm việc

### 1. Core Framework & Runtime Environment
Nhóm các thư viện nền tảng để chạy ứng dụng Next.js App Router và quản lý logic phía Server.
* `next`: Framework chính (Next.js 15).
* `react`, `react-dom`: Thư viện render giao diện (React 18).
* `server-only`: Đảm bảo các module bảo mật (chứa API key, DB query) chỉ chạy ở phía Server.
* `@serwist/next`: Cấu hình Progressive Web App (PWA) tối ưu cho Next.js, hỗ trợ offline và service worker trên Mobile.

### 2. Database & Persistence Layer (SQL & NoSQL)
Nhóm xử lý kết nối, truy vấn dữ liệu và quản lý database (PostgreSQL & Redis).
* `drizzle-orm`: ORM chính để viết query type-safe và quản lý schema.
* `pg`: Driver kết nối PostgreSQL.
* `@neondatabase/serverless`: Driver tối ưu riêng cho Serverless Database của Neon.
* `@supabase/supabase-js`, `@supabase/ssr`: Client và cơ chế xác thực/session của Supabase trong môi trường SSR.
* `@upstash/redis`: Kết nối Redis qua HTTP, chuyên dùng cho Rate Limiting hoặc Caching ở Edge Network.

### 3. AI & LLM Integration (Vercel AI SDK & Gemini)
Hệ sinh thái xử lý AI Agents, Streaming Response và kết nối với Google Gemini.
* `ai`: Vercel AI SDK Core.
* `@ai-sdk/google`: Provider để kết nối Vercel AI SDK với các mô hình Gemini.
* `@ai-sdk/react`: Hooks hỗ trợ UI cho AI (`useChat`, `useCompletion`) ở client.
* `@google/generative-ai`: SDK chính chủ của Google dành cho Gemini (dùng khi call trực tiếp không qua Vercel SDK).

### 4. Content Processing (CMS, Markdown & Math)
Hệ thống phân tách, parse và xử lý nội dung dạng Block, Markdown, Math cho Editor hoặc Blog.
* `unified`, `remark-parse`, `unist-util-visit`: Hệ sinh thái xử lý và duyệt cây cú pháp (AST) của văn bản.
* `react-markdown`: Render Markdown thành React components.
* `remark-gfm`: Hỗ trợ GitHub Flavored Markdown (bảng, link, tasklist).
* `remark-frontmatter`, `yaml`: Parse metadata (frontmatter) ở đầu các file bài viết.
* `remark-math`, `rehype-katex`: Parse và hiển thị các công thức toán học/Latex.
* `marked`: Thư viện parse Markdown sang HTML siêu tốc.
* `sanitize-html`, `rehype-sanitize`: Loại bỏ các script độc hại (XSS) khi render HTML động.

### 5. UI Components & UX Styling
Nhóm cấu hình giao diện, animation và các mẫu UI tinh tế, mượt mà.
* `framer-motion`: Xử lý animation chuyển trang và hiệu ứng UI.
* `swiper`: Thư viện làm slider/carousel mượt mà (đặc biệt tốt trên mobile).
* `lucide-react`: Hệ thống icon tối giản, hiện đại.
* `next-themes`: Quản lý Dark/Light mode không bị giật (flicker).
* `clsx`, `tailwind-merge`: Bộ đôi chuẩn chỉ để gộp và override các class Tailwind CSS.
* `@radix-ui/react-dropdown-menu`: Unstyled component cho Dropdown, đảm bảo khả năng truy cập (Accessibility).
* `@mdxeditor/editor`: Trình soạn thảo WYSIWYG Rich Text hỗ trợ Markdown.
* `react-textarea-autosize`: Textarea tự động co giãn theo độ dài văn bản mà không bị scrollbar.
* `react-syntax-highlighter`: Highlight code block trong các bài viết hoặc câu trả lời của AI.

### 6. State Management & Form Handling
Quản lý trạng thái ứng dụng và validate dữ liệu chặt chẽ từ Client lên Server.
* `zustand`: Quản lý global state cực nhẹ và nhanh thay cho Redux/Context API.
* `react-hook-form`, `@hookform/resolvers`: Bộ đôi quản lý form hiệu năng cao và kết nối với các schema validator.
* `zod`: Thư viện validate Schema dữ liệu (dùng cho cả Form Client, API Route và Environment Variables).

### 7. Utilities & Helpers
Các công cụ phụ trợ xử lý chuỗi, thời gian, debounce và file.
* `date-fns`, `moment`: Xử lý và format thời gian. *(Khuyên dùng: Nên ưu tiên `date-fns` để tree-shaking tốt hơn, tránh thừa thãi bundle size từ `moment`)*.
* `use-debounce`: Trì hoãn thực thu function (ví dụ: chờ người dùng gõ xong mới trigger tìm kiếm).
* `uuid`: Tạo ID ngẫu nhiên không trùng lặp.
* `slugify`: Chuyển tiêu đề có dấu thành chuỗi URL (Ví dụ: "Tâm Việt" -> "tam-viet").
* `qs`: Parse và stringify các query string phức tạp trên URL.
* `sonner`: Thư viện hiển thị thông báo (Toast notification) dạng toast đẹp, gọn gàng.
* `html-to-image`, `react-to-print`: Xuất nội dung giao diện HTML ra ảnh hoặc file PDF để in ấn.

---

### Một vài lưu ý nhỏ để bạn tối ưu:
1. **Trùng lặp tính năng:** Bạn đang có cả `date-fns` lẫn `moment` (đều làm về thời gian), và cả `react-markdown` + `marked` (đều parse Markdown). Nếu được, hãy refactor gom về một thư viện để giảm dung lượng file build.
2. **Bảo mật HTML:** Việc bạn giữ lại `sanitize-html` và `rehype-sanitize` là rất chuẩn xác, đặc biệt khi ứng dụng có nhận data từ AI hoặc người dùng nhập liệu qua Rich Text Editor.
