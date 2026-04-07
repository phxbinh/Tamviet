"use server";

import { z } from "zod";
import { DocumentSchema } from "./blocks";
import { sql } from "@/lib/neon/sql";
import { revalidatePath } from "next/cache";

const CreatePostSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  content: DocumentSchema,
});

export async function createPost(data: unknown) {
  // 1. Kiểm tra dữ liệu an toàn
  const result = CreatePostSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { title, content } = result.data;

  // 2. Tạo slug (Cân nhắc dùng thư viện slugify nếu có tiếng Việt)
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Khử dấu tiếng Việt
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  try {
    // 3. Insert Database
    await sql`
      INSERT INTO posts (title, slug, content_json)
      VALUES (${title}, ${slug}, ${JSON.stringify(content)})
    `;

    // 4. Làm mới cache
    revalidatePath("/blog"); // Ví dụ trang danh sách bài viết
    return { success: true };
    
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Không thể tạo bài viết, vui lòng thử lại sau." };
  }
}
