// src/app/(public)/layout.tsx
import PublicShell from "@/components/layout/PublicShell_x";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicShell>{children}</PublicShell>;
}




