/*
import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  index,
  integer,
  boolean,
  customType,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { vector } from "drizzle-orm/pg-core";

// ✅ custom type cho tsvector (Drizzle chưa support native tốt)
const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const companyPolicies = pgTable(
  "company_policies_v",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    documentId: uuid("document_id"),

    title: text("title"),
    content: text("content").notNull(),

    chunkIndex: integer("chunk_index").default(0),
    tokenCount: integer("token_count").default(0),

    embedding: vector("embedding", { dimensions: 3072 }),

    // structured metadata
    category: text("category").default("Chung"),
    subCategory: text("sub_category"),
    isActive: boolean("is_active").default(true),
    priority: integer("priority").default(0),

    // ✅ GENERATED COLUMN (không required khi insert)
    contentTsv: tsvector("content_tsv")
      .default(sql`to_tsvector('vietnamese', content)`),

    metadata: jsonb("metadata").default({}),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    embeddingIdx: index("embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),

    categoryActiveIdx: index("category_active_idx").on(
      table.category,
      table.isActive
    ),

    activeOnlyIdx: index("active_only_idx")
      .on(table.category)
      .where(sql`is_active = true`),

    contentTsvIdx: index("content_tsv_idx").using(
      "gin",
      table.contentTsv
    ),
  })
);
*/

import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  index,
  integer,
  boolean,
  customType,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { vector } from "drizzle-orm/pg-core";

// ✅ tsvector custom type (read-only)
const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const companyPolicies = pgTable(
  "company_policies_v",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    documentId: uuid("document_id"),

    title: text("title"),
    content: text("content").notNull(),

    chunkIndex: integer("chunk_index").default(0),
    tokenCount: integer("token_count").default(0),

    embedding: vector("embedding", { dimensions: 3072 }),

    category: text("category").default("Chung"),
    subCategory: text("sub_category"),
    isActive: boolean("is_active").default(true),
    priority: integer("priority").default(0),

    // ✅ GENERATED COLUMN → KHÔNG insert, chỉ đọc
    contentTsv: tsvector("content_tsv"),

    metadata: jsonb("metadata").default({}),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
/*
    embeddingIdx: index("embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
*/
    categoryActiveIdx: index("category_active_idx").on(
      table.category,
      table.isActive
    ),

    activeOnlyIdx: index("active_only_idx")
      .on(table.category)
      .where(sql`is_active = true`),

    contentTsvIdx: index("content_tsv_idx").using(
      "gin",
      table.contentTsv
    ),
  })
);




