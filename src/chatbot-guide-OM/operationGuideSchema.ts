// Import lib
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
  numeric,
  index,
} from "drizzle-orm/pg-core";

import { vector } from "drizzle-orm/pg-core";

// Export
// 1. Documents -> ✅ Fixed với sql
export const operationDocuments = pgTable(
  "operation_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    title: text("title").notNull(),

    category: text("category"),

    version: text("version"),

    overview: text("overview"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_operation_documents_category")
      .on(table.category),
  ]
);

// 2. Procedures -> ✅ Fixed với sql
export const operationProcedures = pgTable(
  "operation_procedures",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    documentId: uuid("document_id")
      .notNull()
      .references(() => operationDocuments.id, {
        onDelete: "cascade",
      }),

    title: text("title").notNull(),

    description: text("description"),

    orderIndex: integer("order_index")
      .notNull()
      .default(0),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_operation_procedures_document")
      .on(table.documentId),

    index("idx_operation_procedures_order")
      .on(table.documentId, table.orderIndex),
  ]
);

// 3. Procedure steps -> ✅ Fixed với sql
export const operationSteps = pgTable(
  "operation_steps",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    procedureId: uuid("procedure_id")
      .notNull()
      .references(() => operationProcedures.id, {
        onDelete: "cascade",
      }),

    stepOrder: integer("step_order")
      .notNull(),

    content: text("content")
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_operation_steps_procedure")
      .on(table.procedureId),

    index("idx_operation_steps_order")
      .on(table.procedureId, table.stepOrder),
  ]
);

// 4. Parameters -> ✅ Fixed với sql
export const operationParameters = pgTable(
  "operation_parameters",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    documentId: uuid("document_id")
      .notNull()
      .references(() => operationDocuments.id, {
        onDelete: "cascade",
      }),

    equipment: text("equipment"),

    parameterName: text("parameter_name")
      .notNull(),

    rangeRaw: text("range_raw"),

    minValue: numeric("min_value", {
      precision: 18,
      scale: 4,
    }),

    maxValue: numeric("max_value", {
      precision: 18,
      scale: 4,
    }),

    unit: text("unit"),

    frequency: text("frequency"),

    description: text("description"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_operation_parameters_document")
      .on(table.documentId),

    index("idx_operation_parameters_name")
      .on(table.parameterName),
  ]
);

// 5. Operation health check -> ✅ Fixed với sql
export const operationHealthChecks = pgTable(
  "operation_health_checks",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    documentId: uuid("document_id")
      .notNull()
      .references(() => operationDocuments.id, {
        onDelete: "cascade",
      }),

    statusType: text("status_type")
      .notNull(),

    label: text("label")
      .notNull(),

    value: text("value")
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_operation_health_status")
      .on(table.statusType),

    index("idx_operation_health_document")
      .on(table.documentId),
  ]
);

// 6. Troubleshooting -> ✅ Fixed với sql
export const operationTroubleshooting = pgTable(
  "operation_troubleshooting",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    documentId: uuid("document_id")
      .notNull()
      .references(() => operationDocuments.id, {
        onDelete: "cascade",
      }),

    problem: text("problem").notNull(),

    causes: jsonb("causes")
      .notNull()
      .default(sql`'[]'::jsonb`),

    solutions: jsonb("solutions")
      .notNull()
      .default(sql`'[]'::jsonb`),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_operation_troubleshooting_document")
      .on(table.documentId),

    index("idx_operation_troubleshooting_problem")
      .on(table.problem),
  ]
);

// RAG chunks -> ✅ Fixed với sql
export const operationChunks = pgTable(
  "operation_chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    documentId: uuid("document_id")
      .notNull()
      .references(() => operationDocuments.id, {
        onDelete: "cascade",
      }),

    chunkIndex: integer("chunk_index")
      .notNull(),

    content: text("content")
      .notNull(),

    tokenCount: integer("token_count"),

    embedding: vector("embedding", {
      dimensions: 3072,
    }),

    metadata: jsonb("metadata")
      .default(sql`'{}'::jsonb`),

    isActive: boolean("is_active")
      .notNull()
      .default(true),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
(table) => ({
  embeddingIdx: index(
    "operation_chunks_embedding_idx"
  ).using(
    "hnsw",
    table.embedding.op("vector_cosine_ops")
  ),

  documentIdx: index(
    "idx_operation_chunks_document"
  ).on(table.documentId),

  activeIdx: index(
    "idx_operation_chunks_active"
  ).on(table.isActive),

  documentActiveIdx: index(
    "idx_operation_chunks_document_active"
  ).on(table.documentId, table.isActive),
})
);