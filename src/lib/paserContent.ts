// src/lib/parseContent.ts
import { DocumentSchema, Document } from "@/lib/blocks";

export function parseContent(raw: unknown): Document {
  const data =
    typeof raw === "string" ? JSON.parse(raw) : raw;

  return DocumentSchema.parse(data);
}