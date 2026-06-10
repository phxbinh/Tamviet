// SectionRecord()
export interface SectionRecord {
  level: number;

  title: string;

  sectionPath: string;

  pathSlug: string;

  content: string;

  parentPath: string | null;

  sortOrder: number;
}

// slugify()
export function slugify(
  text: string
): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// chunkRecord()
export interface ChunkRecord {
  sectionPath: string;
  chunkIndex: number;
  content: string;
}
