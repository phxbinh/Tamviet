// src/app/(public)/layout.tsx
// src/app/(public)/layout.tsx
import PublicShell from "@/components/layout/PublicShell";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicShell>{children}</PublicShell>;
}