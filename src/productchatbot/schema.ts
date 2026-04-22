// productchatbot/schema.ts

import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { vector } from "drizzle-orm/pg-vector";

export const productDocuments = pgTable(
  "product_documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    productId: uuid("product_id").notNull(),

    title: text("title").notNull(),
    slug: text("slug").notNull(),

    content: text("content").notNull(),

    metadata: jsonb("metadata").$type<{
      minPrice: number;
      maxPrice: number;
      totalStock: number;
      category?: string;
      attributes: string[];
    }>(),

    embedding: vector("embedding", { dimensions: 3072 }).notNull(),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    embeddingIdx: index("product_documents_embedding_idx")
      .on(table.embedding)
      .using("ivfflat"),
  })
);

/* Cấu trúc data của sản phẩm
{
  "productId": "p1",
  "title": "Áo thun nam basic",
  "slug": "ao-thun-nam-basic-abc123",

  "content": "Tên sản phẩm: Áo thun nam basic...\nBiến thể:\n- Color: Red, Size: M, giá: 120000, tồn: 10\n...",

  "metadata": {
    "minPrice": 115000,
    "maxPrice": 130000,
    "totalStock": 23,
    "categories": "Áo nam",
    "attributes": [
      "Color: Red",
      "Color: Blue",
      "Size: M",
      "Size: L"
    ]
  },

  "embedding": [0.0123, -0.98, ...]
}
*/





