// src/lib/parseContent.ts
import { DocumentSchema } from "./blocks";

export function parseContent(raw: any) {
  const data =
    typeof raw === "string" ? JSON.parse(raw) : raw;

  return DocumentSchema.parse(data);
}