// src/app/(markdwon)/layout.tsx
import MarkdownShell from "@/components/layout/MarkdownShellSB";

export default function MarkdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarkdownShell>{children}</MarkdownShell>;
}