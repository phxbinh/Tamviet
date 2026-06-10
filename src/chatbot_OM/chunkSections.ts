import { SectionRecord } from "./types";

export function chunkSections(
  sections: SectionRecord[],
  maxChars = 1200,
  overlap = 200
) {
  const chunks = [];

  for (const section of sections) {
    const text =
      `${section.sectionPath}\n\n` +
      section.content;

    if (text.length <= maxChars) {
      chunks.push({
        sectionPath: section.sectionPath,
        chunkIndex: 0,
        content: text,
      });

      continue;
    }

    let start = 0;
    let index = 0;

    while (start < text.length) {
      const end = Math.min(
        start + maxChars,
        text.length
      );

      chunks.push({
        sectionPath: section.sectionPath,
        chunkIndex: index++,
        content: text.slice(start, end),
      });

      start += maxChars - overlap;
    }
  }

  return chunks;
}