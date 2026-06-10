import {
  ParsedDocument,
  ParsedSection,
} from "./parseMarkdownToAST";

export interface SectionRecord {
  level: number;
  title: string;
  sectionPath: string;
  pathSlug: string;
  content: string;
  parentPath: string | null;
  sortOrder: number;
}

export function buildSectionRecords(
  document: ParsedDocument
): SectionRecord[] {
  const records: SectionRecord[] = [];

  let order = 0;

  const walk = (
    section: ParsedSection,
    parentPath: string | null
  ) => {
    const sectionPath = parentPath
      ? `${parentPath} > ${section.title}`
      : `${document.title} > ${section.title}`;

    const pathSlug = sectionPath
      .split(" > ")
      .map(slugify)
      .join("/");

    records.push({
      level: section.level,
      title: section.title,
      sectionPath,
      pathSlug,
      content: section.content.trim(),
      parentPath,
      sortOrder: order++,
    });

    for (const child of section.children) {
      walk(child, sectionPath);
    }
  };

  for (const section of document.sections) {
    walk(section, null);
  }

  return records;
}