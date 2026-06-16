export type SectionType =
  | "purpose"
  | "principle"
  | "startup"
  | "operation"
  | "shutdown"
  | "maintenance"
  | "safety"
  | "troubleshooting"
  | "parameter"
  | "other";

export function detectSectionType(
  title: string
): SectionType | null {
  const t =
    title.toLowerCase();

  if (
    t.includes("mục đích")
  ) {
    return "purpose";
  }

  if (
    t.includes("nguyên lý")
  ) {
    return "principle";
  }

  if (
    t.includes("khởi động")
  ) {
    return "startup";
  }

  if (
    t.includes("vận hành")
  ) {
    return "operation";
  }

  if (
    t.includes("dừng")
  ) {
    return "shutdown";
  }

  if (
    t.includes("bảo trì") ||
    t.includes("bảo dưỡng")
  ) {
    return "maintenance";
  }

  if (
    t.includes("an toàn")
  ) {
    return "safety";
  }

  if (
    t.includes("sự cố") ||
    t.includes("khắc phục")
  ) {
    return "troubleshooting";
  }

  if (
    t.includes("thông số")
  ) {
    return "parameter";
  }

  return null;
}