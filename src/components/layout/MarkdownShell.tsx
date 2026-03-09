// src/components/layout/MarkdownShell.tsx
"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Toast } from "@/components/Toast";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { Menu, X } from "lucide-react";
import Link from "next/link";




export default function MarkdownShell({
  children,
}: {
  children: React.ReactNode;
}) {
const [isOpen, setIsOpen] = useState(false);
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





//////

















