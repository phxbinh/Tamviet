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

/*
import 'server-only' // Đảm bảo code chỉ chạy ở server
import { MetadataRoute } from 'next'
import { sql } from "@/lib/neon/sql"; // Giả sử đây là path tới file cấu hình db của bạn

// Cache lại sitemap trong 1 giờ (3600 giây) để đỡ tốn tài nguyên DB
export const revalidate = 3600 


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
*/
/*
import 'server-only';
import { MetadataRoute } from 'next';
import { sql } from "@/lib/neon/sql";

// Tự động cập nhật Sitemap sau mỗi 1 giờ để tiết kiệm tài nguyên Database
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tamviet.vercel.app';

  // 1. Các trang tĩnh (Priority cao nhất)
  const staticRoutes = ['', '/test', '/testSearchParam', '/roadmap', '/login'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  // 2. Lấy Danh mục (Categories) từ Database
  // Giả sử bạn có bảng 'categories' với trường 'slug' (ví dụ: 'the-thao/cau-long')
  const categories = await sql`SELECT slug, updated_at FROM categories`;
  
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/testSearchParam?cat=${cat.slug}`,
    lastModified: new Date(cat.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.9, // Thấp hơn trang chủ nhưng cao hơn sản phẩm
  }));

  // 3. Lấy Sản phẩm (Products) từ Database
  const products = await sql`SELECT slug, updated_at FROM products WHERE status = 'active'`;

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/testSearchParam/products/${product.slug}`,
    lastModified: new Date(product.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Gộp tất cả lại thành một danh sách duy nhất
  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

*/


import { MetadataRoute } from 'next';
import { sql } from "@/lib/neon/sql";

// Cấu hình ISR: Cập nhật sitemap mỗi 1 giờ
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tamviet.vercel.app';

  // 1. Các trang tĩnh (Priority cao nhất)
  const staticRoutes: MetadataRoute.Sitemap = ['', '/test', '/testSearchParam', '/roadmap', '/login'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  }));

  try {
    // 2. Lấy Danh mục (Categories)
    const categories = await sql`SELECT slug, updated_at FROM categories`;
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/testSearchParam?cat=${cat.slug}`,
      lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    // 3. Lấy Sản phẩm (Products)
    const products = await sql`SELECT slug, updated_at FROM products WHERE status = 'active'`;
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/testSearchParam/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (error) {
    console.error("Sitemap error:", error);
    // Nếu DB lỗi, vẫn trả về các trang tĩnh để Google không báo lỗi 500
    return staticRoutes;
  }
}



