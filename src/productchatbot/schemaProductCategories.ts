import { pgTable, uuid, index, primaryKey } from "drizzle-orm/pg-core";
import { products } from "./schemaProducts";
import { categories } from "./schemaCategories";

export const productCategories = pgTable(
  "product_categories",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => ({
    // PRIMARY KEY (product_id, category_id)
    pk: primaryKey({ columns: [table.productId, table.categoryId] }),

    // CREATE INDEX idx_pc_product ON product_categories(product_id)
    productIdx: index("idx_pc_product").on(table.productId),

    // CREATE INDEX idx_pc_category ON product_categories(category_id)
    categoryIdx: index("idx_pc_category").on(table.categoryId),
  })
);