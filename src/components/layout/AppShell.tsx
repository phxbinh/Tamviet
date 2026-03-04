"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Toast } from "@/components/Toast";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* toàn bộ UI bạn viết chuyển vào đây */}
      {children}
    </>
  );
}