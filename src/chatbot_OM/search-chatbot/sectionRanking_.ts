import {
  VectorSearchResult,
} from "../vectorSearch";

function topicBoost(
  topic: string,
  sectionPath: string
) {
  const path =
    sectionPath.toLowerCase();

  switch (topic) {
    case "safety":
      return path.includes(
        "an toàn"
      )
        ? -0.05
        : 0;

    case "startup":
      return path.includes(
        "khởi động"
      )
        ? -0.05
        : 0;

    case "shutdown":
      return path.includes(
        "dừng"
      )
        ? -0.05
        : 0;

    case "maintenance":
      return path.includes(
        "bảo trì"
      )
        ? -0.05
        : 0;

    case "troubleshooting":
      return path.includes(
        "sự cố"
      )
        ? -0.05
        : 0;

    case "parameter":
      return path.includes(
        "thông số"
      )
        ? -0.05
        : 0;

    case "purpose":
      return path.includes(
        "mục đích"
      )
        ? -0.05
        : 0;

    case "principle":
      return path.includes(
        "nguyên lý"
      )
        ? -0.05
        : 0;

    default:
      return 0;
  }
}

export function groupBySection(
  chunks:
    VectorSearchResult[]
) {
  const map =
    new Map<
      string,
      VectorSearchResult
    >();

  for (const row of chunks) {
    const existing =
      map.get(
        row.sectionId
      );

    if (
      !existing ||
      row.distance <
        existing.distance
    ) {
      map.set(
        row.sectionId,
        row
      );
    }
  }

  return [
    ...map.values(),
  ];
}

export function rerankSections(
  sections:
    VectorSearchResult[],

  topic: string
) {
  return sections
    .map((s) => ({
      ...s,

      finalScore:
        s.distance +
        topicBoost(
          topic,
          s.sectionPath
        ),
    }))
    .sort(
      (a, b) =>
        a.finalScore -
        b.finalScore
    );
}