/*
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tamviet.vercel.app' // Thay bằng domain của bạn

  // Giả sử bạn có danh sách bài viết Markdown
  const routes = ['', '/test', '/testSearchParam', '/roadmap', '/login'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  return [...routes]
}
*/



import { MetadataRoute } from 'next'
import { sql } from "@/lib/neon/sql"; // Giả sử đây là path tới file cấu hình db của bạn

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tamviet.vercel.app'

  // 1. Các trang tĩnh
  const staticRoutes = ['', '/test', '/testSearchParam', '/roadmap', '/login'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  // 2. Lấy danh sách slug sản phẩm từ Database
  // Thay đổi query cho đúng với bảng của bạn (ví dụ bảng 'products')
  const products = await sql`SELECT slug, updated_at FROM products WHERE status = 'active'`;

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/testSearchParam/products/${product.slug}`,
    lastModified: new Date(product.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}
