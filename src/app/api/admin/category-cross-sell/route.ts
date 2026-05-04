// src/productchatbot


// Folder: POST /api/admin/category-cross-sell
import { db } from "@/productchatbot";
import { categories } from "@/productchatbot/schemaCategories";
import { categoryCrossSell } from "@/productchatbot/schemaCategoryCrossSell";
import { eq } from "drizzle-orm";
import { dbCrossSell } form "./schema-sql-db"

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
/*
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
*/

export async function POST(req: Request) {
  const body = await req.json();
  const { sourceCategoryId, targetCategoryIds } = body;

  if (!sourceCategoryId) {
    return Response.json(
      { error: "Missing sourceCategoryId" },
      { status: 400 }
    );
  }

  // 1. check source tồn tại
  const source = await dbCrossSell.query.categories.findFirst({
    where: (c, { eq }) => eq(c.id, sourceCategoryId),
  });

  if (!source) {
    return Response.json(
      { error: "Source category not found" },
      { status: 404 }
    );
  }

  // 2. clean target list
  const uniqueTargets = [
    ...new Set(
      (targetCategoryIds || []).filter(
        (id: string) => id && id !== sourceCategoryId
      )
    ),
  ];

  // ✅ 3. CHECK TỒN TẠI Ở ĐÂY
  const targets = await dbCrossSell.query.categories.findMany({
    where: (c, { inArray }) => inArray(c.id, uniqueTargets),
  });

  if (targets.length !== uniqueTargets.length) {
    return Response.json(
      { error: "Some target categories not found" },
      { status: 400 }
    );
  }

  // 4. transaction
  await dbCrossSell.transaction(async (tx) => {
    await tx
      .delete(categoryCrossSell)
      .where(eq(categoryCrossSell.sourceCategoryId, sourceCategoryId));

    if (uniqueTargets.length > 0) {
      await tx.insert(categoryCrossSell).values(
        uniqueTargets.map((id: string, index: number) => ({
          sourceCategoryId,
          targetCategoryId: id,
          priority: 100 - index,
        }))
      );
    }
  });

  return Response.json({ success: true });
}








