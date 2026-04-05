"use server";
import { db } from "@/db"; // Import instance drizzle của bạn
import { posts } from "@/db/schemaEditor";
import slugify from "slugify";

export async function savePostAction(data: { title: string, content: string }) {
  try {
    const slug = slugify(data.title, { lower: true, strict: true });
    
    await db.insert(posts).values({
      title: data.title,
      slug: slug,
      content: data.content,
      isPublished: true,
      publishedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Lỗi khi lưu bài viết" };
  }
}
