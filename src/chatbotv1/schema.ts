import { pgTable, uuid, text, vector, jsonb, timestamp, index, integer, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Custom type cho tsvector (nếu Drizzle chưa hỗ trợ native)
const tsvector = (name: string) => text(name).$type<string>(); // hoặc customType nếu cần

export const companyPolicies = pgTable("company_policies", {
  id: uuid("id").primaryKey().defaultRandom(),

  documentId: uuid("document_id"), // nhóm document

  title: text("title"),
  content: text("content").notNull(),

  chunkIndex: integer("chunk_index").default(0),     // thêm
  tokenCount: integer("token_count").default(0),     // thêm

  embedding: vector("embedding", { dimensions: 3072 }), // khớp với gemini-embedding-001

  // structured metadata
  category: text("category").default("Chung"),
  subCategory: text("sub_category"),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0),

  // Full-text search - Dùng GENERATED COLUMN (tốt nhất)
  contentTsv: tsvector("content_tsv")
    .generatedAlwaysAs((): SQL => sql`to_tsvector('vietnamese', ${sql.identifier("content")})`)
    .stored(),   // .stored() quan trọng để index hoạt động tốt

  // optional metadata
  metadata: jsonb("metadata").default({}),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),

}, (table) => ({
  embeddingIdx: index("embedding_idx")
    .using("hnsw", table.embedding.op("vector_cosine_ops")),

  categoryActiveIdx: index("category_active_idx")
    .on(table.category, table.isActive),

  activeOnlyIdx: index("active_only_idx")
    .on(table.category)
    .where(sql`is_active = true`),

  contentTsvIdx: index("content_tsv_idx")
    .using("gin", table.contentTsv),
}));