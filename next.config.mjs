/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,

  // FIX LỖI SITEMAP: Đảm bảo không tự động thêm dấu gạch chéo cuối trang
  // Google Bot rất kén việc sitemap.xml bị redirect sang sitemap.xml/
  trailingSlash: false,

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
      // Cấu hình riêng cho Sitemap để Google Bot "đọc là hiểu" ngay
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml",
          },
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=59",
          },
        ],
      },
    ];
  },

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
