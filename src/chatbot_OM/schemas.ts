// Import libs
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  index,
  boolean,
  unique,
  check,
  AnyPgColumn,
  numeric,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import { vector } from "drizzle-orm/pg-core";


// 1. asset schema
export const assets = pgTable(
  "assets",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),
    assetType: varchar(
      "asset_type",
      {
        length: 50,
      }
    ).notNull(),
    code: varchar("code", {
      length: 100,
    }),
    name: varchar("name", {
      length: 500,
    }).notNull(),
    description: text(
      "description"
    ),
    metadata: jsonb(
      "metadata"
    )
      .$type<Record<string, unknown>>()
      .default(
        sql`'{}'::jsonb`
      )
      .notNull(),
    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    codeUnique: unique(
      "assets_code_unique"
    ).on(table.code),
    typeNameUnique: unique(
      "assets_type_name_unique"
    ).on(
      table.assetType,
      table.name
    ),
    assetTypeIdx: index(
      "assets_asset_type_idx"
    ).on(
      table.assetType
    ),
    nameIdx: index(
      "assets_name_idx"
    ).on(table.name),
    createdAtIdx: index(
      "assets_created_at_idx"
    ).on(
      table.createdAt
    ),
    assetTypeCheck: check(
      "assets_type_check",
      sql`${table.assetType} IN (
        'process',
        'equipment',
        'chemical',
        'instrument',
        'safety',
        'maintenance'
      )`
    ),
  })
);

// 2. document schema
export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    assetId: uuid("asset_id")
      .references(() => assets.id, {
        onDelete: "cascade",
      })
      .notNull(),

    documentType: varchar(
      "document_type",
      { length: 50 }
    ).notNull(),

    title: varchar("title", {
      length: 500,
    }).notNull(),

    version: varchar("version", {
      length: 50,
    }),

    rawMarkdown: text(
      "raw_markdown"
    ).notNull(),

    contentHash: varchar(
      "content_hash",
      { length: 64 }
    ).notNull(),

    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),

    createdAt: timestamp(
      "created_at",
      { withTimezone: true }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      { withTimezone: true }
    )
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    assetIdx: index(
      "documents_asset_idx"
    ).on(table.assetId),

    typeIdx: index(
      "documents_document_type_idx"
    ).on(table.documentType),

    hashIdx: index(
      "documents_content_hash_idx"
    ).on(table.contentHash),

    assetTitleVersionUnique: unique(
      "documents_asset_title_version_unique"
    ).on(
      table.assetId,
      table.title,
      table.version
    ),
  })
);


// 3. document section schema
/*
export const documentSections = pgTable(
  "document_sections",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    documentId: uuid("document_id")
      .references(() => documents.id, {
        onDelete: "cascade",
      })
      .notNull(),

    parentId: uuid("parent_id").references(
      (): AnyPgColumn =>
        documentSections.id,
      {
        onDelete: "cascade",
      }
    ),

    level: integer("level")
      .notNull(),

    title: varchar("title", {
      length: 500,
    }).notNull(),

    sectionType: varchar(
      "section_type",
      {
        length: 50,
      }
    ),

    sectionPath: text(
      "section_path"
    ).notNull(),

    pathSlug: text(
      "path_slug"
    ).notNull(),

    content: text("content")
      .notNull(),

    sortOrder: integer(
      "sort_order"
    ).notNull(),

    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    documentIdx: index(
      "sections_document_idx"
    ).on(table.documentId),

    parentIdx: index(
      "sections_parent_idx"
    ).on(table.parentId),

    levelIdx: index(
      "sections_level_idx"
    ).on(table.level),

    typeIdx: index(
      "sections_section_type_idx"
    ).on(table.sectionType),

    pathUnique: unique(
      "document_sections_path_unique"
    ).on(
      table.documentId,
      table.sectionPath
    ),

    slugUnique: unique(
      "document_sections_slug_unique"
    ).on(
      table.documentId,
      table.pathSlug
    ),

    levelCheck: check(
      "sections_level_check",
      sql`${table.level} >= 1`
    ),
  })
);
*/

// 3. document section schema
export const documentSections = pgTable(
  "document_sections",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    documentId: uuid("document_id")
      .references(() => documents.id, {
        onDelete: "cascade",
      })
      .notNull(),

    parentId: uuid("parent_id").references(
      (): AnyPgColumn =>
        documentSections.id,
      {
        onDelete: "cascade",
      }
    ),

    level: integer("level")
      .notNull(),

    title: varchar("title", {
      length: 500,
    }).notNull(),

    sectionType: varchar(
      "section_type",
      {
        length: 50,
      }
    ),

    sectionPath: text(
      "section_path"
    ).notNull(),

    pathSlug: text(
      "path_slug"
    ).notNull(),

    content: text("content")
      .notNull(),

    summary: text(
      "summary"
    ),

    keywords: text(
      "keywords"
    )
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    intentTags: text(
      "intent_tags"
    )
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    sortOrder: integer(
      "sort_order"
    ).notNull(),

    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),

    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),

  },
  (table) => ({
    documentIdx: index(
      "sections_document_idx"
    ).on(table.documentId),

    parentIdx: index(
      "sections_parent_idx"
    ).on(table.parentId),

    levelIdx: index(
      "sections_level_idx"
    ).on(table.level),

    typeIdx: index(
      "sections_section_type_idx"
    ).on(table.sectionType),

    pathUnique: unique(
      "document_sections_path_unique"
    ).on(
      table.documentId,
      table.sectionPath
    ),

    slugUnique: unique(
      "document_sections_slug_unique"
    ).on(
      table.documentId,
      table.pathSlug
    ),

    levelCheck: check(
      "sections_level_check",
      sql`${table.level} >= 1`
    ),
  })
);





// 4. document chunks schema
export const documentChunks_ = pgTable(
  "document_chunks",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    documentId: uuid("document_id")
      .references(() => documents.id, {
        onDelete: "cascade",
      })
      .notNull(),

    sectionId: uuid("section_id")
      .references(
        () => documentSections.id,
        {
          onDelete: "cascade",
        }
      )
      .notNull(),

    sectionPath: text(
      "section_path"
    ).notNull(),

    chunkIndex: integer(
      "chunk_index"
    ).notNull(),

    content: text("content")
      .notNull(),

    embedding: vector(
      "embedding",
      {
        dimensions: 3072,
      }
    ),

    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    documentIdx: index(
      "chunks_document_idx"
    ).on(table.documentId),

    sectionIdx: index(
      "chunks_section_idx"
    ).on(table.sectionId),

    sectionChunkUnique: unique(
      "document_chunks_section_chunk_unique"
    ).on(
      table.sectionId,
      table.chunkIndex
    ),

    chunkIndexCheck: check(
      "chunks_index_check",
      sql`${table.chunkIndex} >= 0`
    ),
  })
);


// Thay thế cho documentChunks_ ở trên
export const documentChunks = pgTable(
  "document_chunks",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    documentId: uuid("document_id")
      .references(() => documents.id, {
        onDelete: "cascade",
      })
      .notNull(),

    sectionId: uuid("section_id")
      .references(
        () => documentSections.id,
        {
          onDelete: "cascade",
        }
      )
      .notNull(),

    sectionPath: text(
      "section_path"
    ).notNull(),

    chunkIndex: integer(
      "chunk_index"
    ).notNull(),

    content: text("content")
      .notNull(),

    tokenCount: integer(
      "token_count"
    ).notNull(),

    embedding: vector(
      "embedding",
      {
        dimensions: 3072,
      }
    ),

    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    documentIdx: index(
      "chunks_document_idx"
    ).on(table.documentId),

    sectionIdx: index(
      "chunks_section_idx"
    ).on(table.sectionId),

    tokenCountIdx: index(
      "chunks_token_count_idx"
    ).on(table.tokenCount),

    sectionChunkUnique: unique(
      "document_chunks_section_chunk_unique"
    ).on(
      table.sectionId,
      table.chunkIndex
    ),

    chunkIndexCheck: check(
      "chunks_index_check",
      sql`${table.chunkIndex} >= 0`
    ),

    tokenCountCheck: check(
      "chunks_token_count_check",
      sql`${table.tokenCount} > 0`
    ),
  })
);

