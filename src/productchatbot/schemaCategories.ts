import {
  uuid,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const categories = {
  id: uuid("id").defaultRandom().primaryKey(),

  parentId: uuid("parent_id").references(() => categories.id, {
    onDelete: "set null",
  }),

  name: text("name").notNull(),

  slug: text("slug").notNull(), // ⚠️ không set unique (DB đã dùng lower(slug))

  isActive: boolean("is_active").notNull().default(true),

  displayOrder: integer("display_order").notNull().default(0),

  categoryPath: text("category_path"),

  categoryDepth: integer("category_depth").default(0),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};