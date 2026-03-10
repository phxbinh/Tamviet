// app/(app)/layout.tsx

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
      <div className="fixed bottom-6 right-6 z-50"><ThemeToggle /></div>
      <Toast/>
    </>
  );
}