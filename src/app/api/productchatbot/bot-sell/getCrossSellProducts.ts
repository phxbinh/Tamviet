import { db } from "@/productchatbot";
import { products } from "@/productchatbot/productsSchema";
import { productCategories } from "@/productchatbot/schemaProductCategories";
import { categories } from "@/productchatbot/schemaCategories";
import { categoryCrossSell } from "@/productchatbot/schemaCategoryCrossSell";
import { eq, ne, inArray, like, sql, and } from "drizzle-orm";

export async function getCrossSellProducts(productId: string) {
  // 1. Lấy category của product
  const productCats = await db
    .select({
      categoryId: productCategories.categoryId,
    })
    .from(productCategories)
    .where(eq(productCategories.productId, productId));

  if (productCats.length === 0) return [];

//console.log("1️⃣ productCats:", productCats);


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

//console.log("2️⃣ cats:", cats);

  if (cats.length === 0) return [];

  // 🔥 3. Chọn parent đúng (dùng depth thay vì path.length)
  const validCats = cats.filter(c => c.depth !== null);

  if (validCats.length === 0) return [];

  const parent = validCats.reduce((prev, curr) => {
    return (prev.depth ?? 999) < (curr.depth ?? 999) ? prev : curr;
  });

//console.log("3️⃣ parent:", parent);

  // 4. Lấy cross-sell categories
/*
  const crossSellCats = await db
    .select({
      targetId: categoryCrossSell.targetCategoryId,
    })
    .from(categoryCrossSell)
    .where(eq(categoryCrossSell.sourceCategoryId, parent.id));
*/
const crossSellCats = await db
  .select({
    targetId: categoryCrossSell.targetCategoryId,
  })
  .from(categoryCrossSell)
  .where(inArray(categoryCrossSell.sourceCategoryId, categoryIds));

//console.log("4️⃣ crossSellCats:", crossSellCats);

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

//console.log("5️⃣ targetPaths:", targetPaths);

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

//console.log("6️⃣ expandedTargetCats:", expandedTargetCats);

  const expandedIds = expandedTargetCats.map(c => c.id);

  if (expandedIds.length === 0) return [];

  // 7. Lấy products thuộc các category này
  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      thumbnail_url: products.thumbnail_url,
    })
    .from(products)
    .innerJoin(
      productCategories,
      eq(products.id, productCategories.productId)
    )
    .where(inArray(productCategories.categoryId, expandedIds))
    .limit(3); // 🍏Có thể tăng lên

//console.log("7️⃣ FINAL RESULT:", result);

  return result;
}

// Viết gọi lại từ 6 queries ở trên còn 3 queries
export async function getCrossSellProducts_(productId: string) {
  const productCats = await db
    .select({ categoryId: productCategories.categoryId })
    .from(productCategories)
    .where(eq(productCategories.productId, productId));

  if (!productCats.length) return [];

  const categoryIds = productCats.map(c => c.categoryId);

  const crossSellCats = await db
    .select({ targetId: categoryCrossSell.targetCategoryId })
    .from(categoryCrossSell)
    .where(inArray(categoryCrossSell.sourceCategoryId, categoryIds));

  if (!crossSellCats.length) return [];

  const targetIds = crossSellCats.map(c => c.targetId);

  const result = await db
    .selectDistinct({
      id: products.id,
      name: products.name,
      slug: products.slug,
      thumbnail_url: products.thumbnail_url,
    })
    .from(products)
    .innerJoin(
      productCategories,
      eq(products.id, productCategories.productId)
    )
    .where(inArray(productCategories.categoryId, targetIds))
    .limit(6);

  return result;
}




//import { and, eq, inArray, like, sql } from "drizzle-orm";

export async function getCrossSellProductsOptimized(productId: string) {
  const productCats = await db
    .select({ categoryId: productCategories.categoryId })
    .from(productCategories)
    .where(eq(productCategories.productId, productId));

  if (!productCats.length) return [];

  const categoryIds = productCats.map(c => c.categoryId);

  // 2. Lấy target categories + path
  const targets = await db
    .select({
      targetId: categoryCrossSell.targetCategoryId,
      path: categories.categoryPath,
    })
    .from(categoryCrossSell)
    .innerJoin(
      categories, 
      eq(categories.id, categoryCrossSell.targetCategoryId)
    )
    .where(
      and(
        inArray(categoryCrossSell.sourceCategoryId, categoryIds),
        sql`${categories.categoryPath} IS NOT NULL`
      )
    );

  if (!targets.length) return [];

  // 3. Xây dựng điều kiện LIKE cho subtree
  const likeConditions = targets.map(t => 
    like(categories.categoryPath, `${t.path}%`)
  );

  // 4. Lấy sản phẩm
/* Kết quả trả về có sản phẩm bị trùng với sản phẩm user tìm
  const result = await db
    .selectDistinct({
      id: products.id,
      name: products.name,
      slug: products.slug,
      thumbnail_url: products.thumbnail_url,
    })
    .from(products)
    .innerJoin(
      productCategories, 
      eq(products.id, productCategories.productId)
    )
    .innerJoin(
      categories, 
      eq(categories.id, productCategories.categoryId)
    )
    .where(sql.join(likeConditions, sql` OR `))
    .limit(6);
*/

  const result = await db
    .selectDistinct({
      id: products.id,
      name: products.name,
      slug: products.slug,
      thumbnail_url: products.thumbnail_url,
    })
    .from(products)
    .innerJoin(productCategories, eq(products.id, productCategories.productId))
    .innerJoin(categories, eq(categories.id, productCategories.categoryId))
/*
    .where(
      and(
        sql.join(likeConditions, sql` OR `),
        //eq(products.id, productId) === false   // ❌ Loại trừ sản phẩm hiện tại
        ne(products.id, productId)
      )
    )*/
    .where(
      and(
        sql.join(likeConditions, sql` OR `),
        ne(products.id, productId),
        sql`${products.id} != ${productId}`   // Ép điều kiện raw
      )
    )
    .limit(6);

  return result;
}

