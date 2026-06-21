import { db } from "@/dbchatbot";
import { documentSections } from "@/chatbot_OM/schemas";
import { eq } from "drizzle-orm";

export async function getSectionDetails(
  sectionId: string
) {
  const rows = await db
    .select()
    .from(documentSections)
    .where(
      eq(documentSections.id, sectionId)
    )
    .limit(1);

  return rows[0] ?? null;
}