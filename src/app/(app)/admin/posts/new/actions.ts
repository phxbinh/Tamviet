"use server";

import { db } from "@/lib/db"; // Đường dẫn tới file khởi tạo drizzle ở bước 1
import { posts } from "@/lib/db/schemaEditor";
import slugify from "slugify";
import { revalidatePath } from "next/cache";

interface SavePostInput {
  title: string;
  content: string;
  categoryId?: string;
  postType?: "blog" | "repost" | "newspaper";
  metadata?: any;
}

export async function savePostAction(data: SavePostInput) {
  try {
    // 1. Tạo slug sạch từ tiêu đề (Dùng slugify đã có trong package.json của bạn)
    const slug = slugify(data.title, { 
      lower: true, 
      strict: true, 
      locale: 'vi' // Hỗ trợ tiếng Việt tốt hơn cho dự án Tâm Việt
    });

    // 2. Thực hiện Insert vào Neon qua Drizzle
    // Drizzle sẽ tự động dùng Pool từ file pg.ts của bạn
    const [newPost] = await db.insert(posts).values({
      title: data.title,
      slug: slug,
      content: data.content,
      categoryId: data.categoryId || null,
      postType: data.postType || "blog",
      metadata: data.metadata || {},
      isPublished: true,
      publishedAt: new Date(),
    }).returning(); // Trả về dòng vừa insert để lấy ID nếu cần

    // 3. Làm mới cache của trang Blog để bài viết mới hiện lên ngay lập tức
    revalidatePath("/blog");
    revalidatePath("/admin/posts");

    return { 
      success: true, 
      data: { id: newPost.id, slug: newPost.slug } 
    };

  } catch (error: any) {
    console.error("❌ Lỗi Server Action:", error);
    
    // Xử lý lỗi trùng Slug (Unique constraint)
    if (error.code === '23505') {
      return { success: false, error: "Tiêu đề này đã tồn tại, vui lòng đổi tiêu đề khác." };
    }

    return { 
      success: false, 
      error: error.message || "Không thể lưu bài viết vào Database." 
    };
  }
}
