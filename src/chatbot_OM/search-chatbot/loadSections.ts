import { db } from "../../dbchatbot";

import {
  documentSections,
} from "../schemas";

import {
  inArray,
} from "drizzle-orm";

export async function loadSections(
  sectionIds: string[]
) {
  return db
    .select()
    .from(
      documentSections
    )
    .where(
      inArray(
        documentSections.id,
        sectionIds
      )
    );
}