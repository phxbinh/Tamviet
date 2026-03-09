// src/components/sidebar/SidebarHeader.tsx
"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface SidebarHeaderProps {
  onClose: () => void;
}

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
      <Link href="/">
        <span className="font-bold tracking-tighter">
          TÂM<span className="text-neon-cyan"> VIỆT</span>
        </span>
      </Link>
      <button
        onClick={onClose}
        className="md:hidden p-2 hover:bg-accent rounded-full transition-colors"
        aria-label="Close sidebar"
      >
        <X size={18} />
      </button>
    </div>
  );
}