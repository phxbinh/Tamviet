import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Cho phép Next.js nén dữ liệu để Service Worker tải về nhanh hơn trên iPhone
  compress: true,

  // 2. Cấu hình Headers để Safari KHÔNG chặn Cache
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },

  // 3. (Tùy chọn) Nếu bạn dùng hình ảnh từ bên ngoài (ví dụ Cloudinary/S3) cho sản phẩm
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Cho phép cache ảnh từ mọi nguồn hoặc cấu hình domain cụ thể của bạn
      },
    ],
  },
};

export default nextConfig;
