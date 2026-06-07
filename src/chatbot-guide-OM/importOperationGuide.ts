// 

// Import sql
//src/dbchatbot/index.ts
import { db } from "./dbchatbot/index";

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

import {
ParsedGuide,
GuideChunk,
} from "./types";

import {
generateObject,
embed,
} from "ai";

import { google } from "@ai-sdk/google";

export async function importOperationGuide(
markdown: string
) {
// ==================================================
// 1. PARSE MARKDOWN -> STRUCTURED JSON
// ==================================================

const result = await generateObject({
model: google(
"gemini-2.5-flash"
),

schema: parsedGuideSchema,
prompt: `
Bạn là chuyên gia xử lý tài liệu vận hành.
Nhiệm vụ:
1. Đọc markdown.
2. Chuyển thành JSON đúng schema.
3. Trích xuất:
    * overview
    * parameters
    * procedures
    * healthChecks
    * troubleshooting
Markdown:
${markdown}
`,
});

const guide =
result.object as ParsedGuide;

// ==================================================
// 2. CREATE CHUNKS
// ==================================================

const chunks =
createGuideChunks(guide);

// ==================================================
// 3. EMBEDDINGS
// ==================================================

const chunkEmbeddings =
await Promise.all(
chunks.map(
async (chunk) => {
const embeddingRes =
await embed({
model: google.embedding("gemini-embedding-001"),
          value:
            chunk.content,
        });
      return {
        ...chunk,
        embedding:
          embeddingRes.embedding,
      };
    }
  )
);

// ==================================================
// 4. TRANSACTION
// ==================================================

return db.transaction(
async (tx) => {

  // ------------------------------------------
  // DOCUMENT
  // ------------------------------------------
  const [document] =
    await tx
      .insert(
        operationDocuments
      )
      .values({
        title: guide.title,
        category:
          guide.category,
        version:
          guide.version,
        overview:
          guide.overview,
      })
      .returning();
  const documentId =
    document.id;
  // ------------------------------------------
  // PROCEDURES
  // ------------------------------------------
  for (
    let i = 0;
    i <
    guide.procedures.length;
    i++
  ) {
    const procedure =
      guide.procedures[i];
    const [createdProcedure] =
      await tx
        .insert(
          operationProcedures
        )
        .values({
          documentId,
          title:
            procedure.title,
          description:
            procedure.description,
          orderIndex: i,
        })
        .returning();
    if (
      procedure.steps.length >
      0
    ) {
      await tx
        .insert(
          operationSteps
        )
        .values(
          procedure.steps.map(
            (step) => ({
              procedureId:
                createdProcedure.id,
              stepOrder:
                step.order,
              content:
                step.content,
            })
          )
        );
    }
  }
  // ------------------------------------------
  // PARAMETERS
  // ------------------------------------------
  if (
    guide.parameters.length >
    0
  ) {
    await tx
      .insert(
        operationParameters
      )
      .values(
        guide.parameters.map(
          (p) => ({
            documentId,
            equipment:
              p.equipment,
            parameterName:
              p.parameterName,
            rangeRaw:
              p.rangeRaw,
            minValue:
              p.minValue,
            maxValue:
              p.maxValue,
            unit:
              p.unit,
            frequency:
              p.frequency,
            description:
              p.description,
          })
        )
      );
  }
  // ------------------------------------------
  // HEALTH CHECKS
  // ------------------------------------------
  if (
    guide.healthChecks
      .length > 0
  ) {
    await tx
      .insert(
        operationHealthChecks
      )
      .values(
        guide.healthChecks.map(
          (h) => ({
            documentId,
            statusType:
              h.statusType,
            label:
              h.label,
            value:
              h.value,
          })
        )
      );
  }
  // ------------------------------------------
  // TROUBLESHOOTING
  // ------------------------------------------
  if (
    guide.troubleshooting
      .length > 0
  ) {
    await tx
      .insert(
        operationTroubleshooting
      )
      .values(
        guide.troubleshooting.map(
          (t) => ({
            documentId,
            problem:
              t.problem,
            causes:
              t.causes,
            solutions:
              t.solutions,
          })
        )
      );
  }
  // ------------------------------------------
  // CHUNKS
  // ------------------------------------------
  if (
    chunkEmbeddings.length >
    0
  ) {
    await tx
      .insert(
        operationChunks
      )
      .values(
        chunkEmbeddings.map(
          (
            chunk
          ) => ({
            documentId,
            chunkIndex:
              chunk.chunkIndex,
            content:
              chunk.content,
            tokenCount:
              Math.ceil(
                chunk.content
                  .length / 4
              ),
            embedding:
              chunk.embedding,
            metadata:
              chunk.metadata,
            isActive:
              true,
          })
        )
      );
  }
  return {
    success: true,
    documentId,
    title:
      guide.title,
    chunkCount:
      chunkEmbeddings.length,
    procedureCount:
      guide.procedures.length,
    parameterCount:
      guide.parameters.length,
    healthCheckCount:
      guide.healthChecks
        .length,
    troubleshootingCount:
      guide.troubleshooting
        .length,
  };
}

);
}
