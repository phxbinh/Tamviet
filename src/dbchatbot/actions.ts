import { db } from "./index";
import { companyPolicies } from "./schema";
import { sql } from "drizzle-orm";

export async function findRelevantPolicies(targetEmbedding: number[]) {
  // targetEmbedding là tọa độ của câu hỏi từ người dùng
  const items = await db
    .select({
      content: companyPolicies.content,
      // Tính toán độ tương đồng (1 - khoảng cách = độ giống nhau)
      similarity: sql<number>`1 - (${companyPolicies.embedding} <=> ${JSON.stringify(targetEmbedding)})`,
    })
    .from(companyPolicies)
    .where(sql`1 - (${companyPolicies.embedding} <=> ${JSON.stringify(targetEmbedding)}) > 0.5`) // Chỉ lấy kết quả giống trên 50%
    .orderBy(sql`similarity desc`) // Thằng nào giống nhất xếp lên đầu
    .limit(3); // Lấy 3 đoạn liên quan nhất

  return items;
}
