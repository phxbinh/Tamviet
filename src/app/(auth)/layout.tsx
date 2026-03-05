// app/(auth)/layout.tsx

import { Toast } from "@/components/Toast";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}