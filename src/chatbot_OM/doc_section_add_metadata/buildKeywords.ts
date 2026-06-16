export function buildKeywords(
  title: string,
  sectionPath: string
) {
  const words =
    `${title} ${sectionPath}`
      .toLowerCase()
      .replace(
        /[^\p{L}\p{N}\s]/gu,
        ""
      )
      .split(/\s+/)
      .filter(
        (x) => x.length > 2
      );

  return [
    ...new Set(words)
  ].slice(0, 20);
}