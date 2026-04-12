// src/lib/postLib/fetchPost.ts
import { sql } from "@/lib/neon/sql";
import { DocumentSchema } from "./blocks";

export async function getPostBySlug(slug: string) {
  const result = await sql`
    SELECT title, content_json, created_at 
    FROM posts 
    WHERE slug = ${slug} 
    LIMIT 1
  `;

  if (!result[0]) return null;

  const rawData = result[0].content_json;
  
  // Đảm bảo data là Object trước khi parse qua Zod
  const jsonContent = typeof rawData === "string" ? JSON.parse(rawData) : rawData;

  // Validate bằng Schema của ông
  const validated = DocumentSchema.safeParse(jsonContent);

  if (!validated.success) {
    console.error("Zod Validation Error:", validated.error.format());
    // Trả về dữ liệu thô nếu parse lỗi để chữa cháy, hoặc xử lý error tùy ông
    return {
      post: result[0],
      content: jsonContent, 
      isValid: false
    };
  }

  return {
    post: result[0],
    content: validated.data,
    isValid: true
  };
}
