"use server";

import { db } from "@/lib/db"; // Đường dẫn tới file khởi tạo drizzle của bạn
import { posts, categories } from "@/lib/db/schemaEditor";
import { eq, desc, and } from "drizzle-orm";

/**
 * Lấy danh sách bài viết (Pagination ready)
 */
export async function getPostsAction(limit = 10) {
  try {
    const data = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        postType: posts.postType,
        publishedAt: posts.publishedAt,
        categoryName: categories.name,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.isPublished, true))
      .orderBy(desc(posts.publishedAt))
      .limit(limit);

    return { success: true, data };
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách bài viết:", error);
    return { success: false, error: "Không thể tải danh sách bài viết." };
  }
}

/**
 * Lấy chi tiết một bài viết theo Slug
 */
export async function getPostBySlugAction(slug: string) {
  try {
    const [post] = await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.slug, slug),
          eq(posts.isPublished, true)
        )
      )
      .limit(1);

    if (!post) {
      return { success: false, error: "Không tìm thấy bài viết." };
    }

    return { success: true, data: post };
  } catch (error) {
    console.error("❌ Lỗi lấy chi tiết bài viết:", error);
    return { success: false, error: "Lỗi hệ thống khi tải bài viết." };
  }
}
