/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Nén dữ liệu để tải nhanh trên iPhone
  compress: true,

  // 2. Cấu hình Headers để Safari không chặn Cache của Service Worker
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

  // 3. Cho phép hiển thị ảnh từ các nguồn bên ngoài (nếu có)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", 
      },
    ],
  },
};

export default nextConfig;
