import {
  pgTable,
  uuid,
  integer,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import { categories } from "./schemaCategories";

export const categoryCrossSell = pgTable(
  "category_cross_sell",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    sourceCategoryId: uuid("source_category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),

    targetCategoryId: uuid("target_category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),

    priority: integer("priority").default(0),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniquePair: uniqueIndex("unique_cross_sell").on(
      table.sourceCategoryId,
      table.targetCategoryId
    ),

    sourceIdx: index("idx_cross_sell_source").on(
      table.sourceCategoryId
    ),

    targetIdx: index("idx_cross_sell_target").on(
      table.targetCategoryId
    ),

    priorityIdx: index("idx_cross_sell_priority").on(
      table.sourceCategoryId,
      table.priority
    ),
  })
);