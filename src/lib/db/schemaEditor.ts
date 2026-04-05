import { pgTable, text, timestamp, uuid, jsonb, boolean, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable("blog_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

export const posts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(), // Lưu chuỗi Markdown từ MDX Editor
  postType: varchar("post_type", { length: 20 }).default("blog"),
  metadata: jsonb("metadata").default({}),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
