import { db } from "@/productchatbot";
import { products } from "@/productchatbot/productsSchema";
import { productCategories } from "@/productchatbot/schemaProductCategories";
import { categories } from "@/productchatbot/schemaCategories";
import { categoryCrossSell } from "@/productchatbot/schemaCategoryCrossSell";
import { eq, inArray, like, sql } from "drizzle-orm";

export async function getCrossSellProducts(productId: string) {
  // 1. Lấy category của product
  const productCats = await db
    .select({
      categoryId: productCategories.categoryId,
    })
    .from(productCategories)
    .where(eq(productCategories.productId, productId));

  if (productCats.length === 0) return [];

  const categoryIds = productCats.map(c => c.categoryId);

  // 2. Lấy category + path + depth
  const cats = await db
    .select({
      id: categories.id,
      path: categories.categoryPath,
      depth: categories.categoryDepth,
    })
    .from(categories)
    .where(inArray(categories.id, categoryIds));

  if (cats.length === 0) return [];

  // 🔥 3. Chọn parent đúng (dùng depth thay vì path.length)
  const validCats = cats.filter(c => c.depth !== null);

  if (validCats.length === 0) return [];

  const parent = validCats.reduce((prev, curr) => {
    return (prev.depth ?? 999) < (curr.depth ?? 999) ? prev : curr;
  });

  // 4. Lấy cross-sell categories
  const crossSellCats = await db
    .select({
      targetId: categoryCrossSell.targetCategoryId,
    })
    .from(categoryCrossSell)
    .where(eq(categoryCrossSell.sourceCategoryId, parent.id));

  if (crossSellCats.length === 0) return [];

  const targetIds = crossSellCats.map(c => c.targetId);

  // 5. Lấy path của target categories (lọc null)
  const targetPaths = await db
    .select({
      id: categories.id,
      path: categories.categoryPath,
    })
    .from(categories)
    .where(inArray(categories.id, targetIds));

  const validTargetPaths = targetPaths.filter(tp => tp.path);

  if (validTargetPaths.length === 0) return [];

  // 6. Expand subtree bằng LIKE
  const likeConditions = validTargetPaths.map(tp =>
    like(categories.categoryPath, `${tp.path!}%`)
  );

  const expandedTargetCats = await db
    .select({ id: categories.id })
    .from(categories)
    .where(sql.join(likeConditions, sql` OR `));

  const expandedIds = expandedTargetCats.map(c => c.id);

  if (expandedIds.length === 0) return [];

  // 7. Lấy products thuộc các category này
  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
    })
    .from(products)
    .innerJoin(
      productCategories,
      eq(products.id, productCategories.productId)
    )
    .where(inArray(productCategories.categoryId, expandedIds))
    .limit(10);

  return result;
}