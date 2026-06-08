import { db } from "../dbchatbot";

import {
  operationDocuments,
  operationProcedures,
  operationSteps,
  operationParameters,
  operationHealthChecks,
  operationTroubleshooting,
  operationChunks,
} from "./operationGuideSchema";

import { createGuideChunks } from "./createChunks";
import { parsedGuideSchema } from "./schemas";
import { ParsedGuide } from "./types";

import { generateObject, embed } from "ai";
import { google } from "@ai-sdk/google";

import { sql, eq, and } from "drizzle-orm";

export async function importOperationGuide(markdown: string) {
  // ==================================================
  // 1. PARSE MARKDOWN
  // ==================================================
  const result = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: parsedGuideSchema,
    prompt: `
Bạn là chuyên gia xử lý tài liệu vận hành.

Trích xuất markdown thành JSON:
- title
- category
- version
- overview
- procedures
- parameters
- healthChecks
- troubleshooting

Markdown:
${markdown}
`,
  });

  const guide = result.object as ParsedGuide;

  // ==================================================
  // 2. CREATE CHUNKS
  // ==================================================
  const chunks = createGuideChunks(guide);

  // ==================================================
  // 3. EMBEDDINGS
  // ==================================================
  const chunkEmbeddings = await Promise.all(
    chunks.map(async (chunk) => {
      const embeddingRes = await embed({
        model: google.embedding("gemini-embedding-001"),
        value: chunk.content,
      });

      return {
        ...chunk,
        embedding: embeddingRes.embedding,
      };
    })
  );

  // ==================================================
  // 4. UPSERT PIPELINE (NO TRANSACTION)
  // ==================================================

  // ---------------- DOCUMENT ----------------
  const [document] = await db
    .insert(operationDocuments)
    .values({
      title: guide.title,
      category: guide.category,
      version: guide.version,
      overview: guide.overview,
    })
    .onConflictDoUpdate({
      target: operationDocuments.id,
      set: {
        title: sql`excluded.title`,
        category: sql`excluded.category`,
        version: sql`excluded.version`,
        overview: sql`excluded.overview`,
        updatedAt: sql`now()`,
      },
    })
    .returning();

  const documentId = document.id;

  // ---------------- PROCEDURES ----------------
  for (let i = 0; i < guide.procedures.length; i++) {
    const p = guide.procedures[i];

    const [procedure] = await db
      .insert(operationProcedures)
      .values({
        documentId,
        title: p.title,
        description: p.description,
        orderIndex: i,
      })
      .onConflictDoUpdate({
        target: [operationProcedures.documentId, operationProcedures.orderIndex],
        set: {
          title: sql`excluded.title`,
          description: sql`excluded.description`,
        },
      })
      .returning();

    const procedureId = procedure.id;

    // ---------------- STEPS ----------------
    if (p.steps.length) {
      await db
        .insert(operationSteps)
        .values(
          p.steps.map((s) => ({
            procedureId,
            stepOrder: s.order,
            content: s.content,
          }))
        )
        .onConflictDoUpdate({
          target: [operationSteps.procedureId, operationSteps.stepOrder],
          set: {
            content: sql`excluded.content`,
          },
        });
    }
  }

  // ---------------- PARAMETERS ----------------
  if (guide.parameters.length) {
    await db
      .insert(operationParameters)
      .values(
        guide.parameters.map((p) => ({
          documentId,
          equipment: p.equipment,
          parameterName: p.parameterName,
          rangeRaw: p.rangeRaw,
          minValue: p.minValue != null ? String(p.minValue) : null,
          maxValue: p.maxValue != null ? String(p.maxValue) : null,
          unit: p.unit,
          frequency: p.frequency,
          description: p.description,
        }))
      )
      .onConflictDoUpdate({
        target: [operationParameters.documentId, operationParameters.parameterName],
        set: {
          equipment: sql`excluded.equipment`,
          rangeRaw: sql`excluded.range_raw`,
          minValue: sql`excluded.min_value`,
          maxValue: sql`excluded.max_value`,
          unit: sql`excluded.unit`,
          frequency: sql`excluded.frequency`,
          description: sql`excluded.description`,
        },
      });
  }

  // ---------------- HEALTH CHECKS ----------------
  if (guide.healthChecks.length) {
    await db
      .insert(operationHealthChecks)
      .values(
        guide.healthChecks.map((h) => ({
          documentId,
          statusType: h.statusType,
          label: h.label,
          value: h.value,
        }))
      )
      .onConflictDoUpdate({
        target: [
          operationHealthChecks.documentId,
          operationHealthChecks.statusType,
          operationHealthChecks.label,
        ],
        set: {
          value: sql`excluded.value`,
        },
      });
  }

  // ---------------- TROUBLESHOOTING ----------------
  if (guide.troubleshooting.length) {
    await db
      .insert(operationTroubleshooting)
      .values(
        guide.troubleshooting.map((t) => ({
          documentId,
          problem: t.problem,
          causes: t.causes,
          solutions: t.solutions,
        }))
      )
      .onConflictDoUpdate({
        target: [operationTroubleshooting.documentId, operationTroubleshooting.problem],
        set: {
          causes: sql`excluded.causes`,
          solutions: sql`excluded.solutions`,
        },
      });
  }

  // ---------------- CHUNKS ----------------
  if (chunkEmbeddings.length) {
    await db
      .insert(operationChunks)
      .values(
        chunkEmbeddings.map((c) => ({
          documentId,
          chunkIndex: c.chunkIndex,
          content: c.content,
          tokenCount: Math.ceil(c.content.length / 4),
          embedding: c.embedding,
          metadata: c.metadata,
          isActive: true,
        }))
      )
      .onConflictDoUpdate({
        target: [operationChunks.documentId, operationChunks.chunkIndex],
        set: {
          content: sql`excluded.content`,
          embedding: sql`excluded.embedding`,
          metadata: sql`excluded.metadata`,
        },
      });
  }

  // ==================================================
  return {
    success: true,
    documentId,
    title: guide.title,
    chunkCount: chunkEmbeddings.length,
  };
}