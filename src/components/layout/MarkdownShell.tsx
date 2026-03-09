// src/components/layout/MarkdownShell.tsx
"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";


export default function MarkdownShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        {children}
      <Toast />
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </>
  );
}




