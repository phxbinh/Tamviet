// src/app/(markdwon)/layout.tsx
import MarkdownShell from "@/components/layout/MarkdownShell";

export default function MarkdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarkdownShell>{children}</MarkdownShell>;
}