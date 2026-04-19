// src/dbchatbot/schema.ts

import { pgTable, uuid, text, vector } from "drizzle-orm/pg-core";

export const companyPolicies = pgTable("company_policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 3072 }), 
  metadata: text("metadata"),
});
