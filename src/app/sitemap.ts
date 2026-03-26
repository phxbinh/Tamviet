import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tamviet.vercel.app' // Thay bằng domain của bạn

  // Giả sử bạn có danh sách bài viết Markdown
  const routes = ['', '/test', '/testSearchParam', '/roadmap'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  return [...routes]
}
