import { SectionRecord } from "./buildSectionRecords";

export interface ChunkRecord {
  sectionPath: string;

  chunkIndex: number;

  content: string;

  tokenCount: number;
}

export function estimateTokens(
  text: string
) {
  return Math.ceil(
    text.length / 4
  );
}

export function chunkSections(
  sections: SectionRecord[],
  maxChars = 1200,
  overlap = 200
): ChunkRecord[] {
  const chunks: ChunkRecord[] =
    [];

  for (const section of sections) {
    const text =
      `${section.sectionPath}\n\n${section.content}`;

    //--------------------------------
    // Small section
    //--------------------------------

    if (
      text.length <= maxChars
    ) {
      chunks.push({
        sectionPath:
          section.sectionPath,

        chunkIndex: 0,

        content: text,

        tokenCount:
          estimateTokens(
            text
          ),
      });

      continue;
    }

    //--------------------------------
    // Large section
    //--------------------------------

    let start = 0;

    let index = 0;

    while (
      start < text.length
    ) {
      const end =
        Math.min(
          start +
            maxChars,
          text.length
        );

      const chunkText =
        text.slice(
          start,
          end
        );

      chunks.push({
        sectionPath:
          section.sectionPath,

        chunkIndex:
          index++,

        content:
          chunkText,

        tokenCount:
          estimateTokens(
            chunkText
          ),
      });

      start +=
        maxChars -
        overlap;
    }
  }

  return chunks;
}