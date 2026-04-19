// src/dbchatbot/schema.ts

import { pgTable, uuid, text, vector } from "drizzle-orm/pg-core";

export const companyPolicies = pgTable("company_policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 3072 }), 
  metadata: text("metadata"),
});


/* 🟢tối ưu schema data cho chatbot

import { pgTable, uuid, text, vector, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const companyPolicies = pgTable("company_policies", {
  id: uuid("id").primaryKey().defaultRandom(),

  documentId: uuid("document_id"), // nhóm document

  title: text("title"),
  content: text("content").notNull(),

  chunkIndex: integer("chunk_index"),
  tokenCount: integer("token_count"),

  embedding: vector("embedding", { dimensions: 3072 }),

  // structured metadata
  category: text("category"),
  subCategory: text("sub_category"),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0),

  // full-text search
  contentTsv: tsvector("content_tsv"),

  // optional metadata
  metadata: jsonb("metadata").default({}),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),

}, (table) => ({
  embeddingIdx: index("embedding_idx")
    .using("hnsw", table.embedding.vector_cosine_ops),

  categoryActiveIdx: index("category_active_idx")
    .on(table.category, table.isActive),

  activeOnlyIdx: index("active_only_idx")
    .on(table.category)
    .where(sql`is_active = true`),

  contentTsvIdx: index("content_tsv_idx")
    .using("gin", table.contentTsv),
}));


*/