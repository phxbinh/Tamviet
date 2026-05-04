// src/productchatbot


// Folder: POST /api/admin/category-cross-sell
import { db } from "@/productchatbot";
import { categories } from "@/productchatbot/schemaCategories";
import { categoryCrossSell } from "@/productchatbot/schemaCategoryCrossSell";
import { eq } from "drizzle-orm";

// GET
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sourceId = searchParams.get("sourceId");

  if (!sourceId) {
    return Response.json({ error: "Missing sourceId" }, { status: 400 });
  }

  const data = await db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categoryCrossSell)
    .innerJoin(
      categories,
      eq(categoryCrossSell.targetCategoryId, categories.id)
    )
    .where(eq(categoryCrossSell.sourceCategoryId, sourceId));

  return Response.json(data);
}

// POST
export async function POST(req: Request) {
  const body = await req.json();
  const { sourceCategoryId, targetCategoryIds } = body;

  if (!sourceCategoryId) {
    return Response.json(
      { error: "Missing sourceCategoryId" },
      { status: 400 }
    );
  }

  // delete old
  await db
    .delete(categoryCrossSell)
    .where(eq(categoryCrossSell.sourceCategoryId, sourceCategoryId));

  // insert new
  if (targetCategoryIds?.length > 0) {
    await db.insert(categoryCrossSell).values(
      targetCategoryIds.map((id: string, index: number) => ({
        sourceCategoryId,
        targetCategoryId: id,
        priority: 100 - index,
      }))
    );
  }

  return Response.json({ success: true });
}







