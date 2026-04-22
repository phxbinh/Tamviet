import { pgTable, uuid, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { vector } from "drizzle-orm/pg-vector";

export const productDocuments = pgTable("product_documents", {
  id: uuid("id").defaultRandom().primaryKey(),

  productId: uuid("product_id").notNull(),

  title: text("title").notNull(),
  slug: text("slug").notNull(),

  // content dùng để embed + RAG context
  content: text("content").notNull(),

  // metadata để filter nhanh (không cần parse content)
  metadata: jsonb("metadata").$type<{
    minPrice: number;
    maxPrice: number;
    totalStock: number;
    categories?: string;
    attributes?: string[]; // ["Color: Red", "Size: M"]
  }>(),

  embedding: vector("embedding", { dimensions: 3072 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});