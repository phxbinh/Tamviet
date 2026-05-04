import { db } from "@/productchatbot";
import { products } from "@/productchatbot/productsSchema";
import { productCategories } from "@/productchatbot/schemaProductCategories";
import { categories } from "@/productchatbot/schemaCategories";
import { categoryCrossSell } from "@/productchatbot/schemaCategoryCrossSell"
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

  // 2. Lấy category_path của các category này
  const cats = await db
    .select({
      id: categories.id,
      path: categories.categoryPath,
    })
    .from(categories)
    .where(inArray(categories.id, categoryIds));

  if (cats.length === 0) return [];

  // 3. Tìm parent level (use-case level)
  // 👉 lấy path ngắn nhất (ít depth nhất)
  const parent = cats.reduce((prev, curr) => {
    return prev.path.length < curr.path.length ? prev : curr;
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

  // 5. Expand subtree của target categories
  const targetPaths = await db
    .select({
      id: categories.id,
      path: categories.categoryPath,
    })
    .from(categories)
    .where(inArray(categories.id, targetIds));

  if (targetPaths.length === 0) return [];

  // build LIKE conditions
  const likeConditions = targetPaths.map(tp =>
    like(categories.categoryPath, `${tp.path}%`)
  );

  const expandedTargetCats = await db
    .select({ id: categories.id })
    .from(categories)
    .where(sql.join(likeConditions, sql` OR `));

  const expandedIds = expandedTargetCats.map(c => c.id);

  // 6. Lấy products thuộc các category này
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