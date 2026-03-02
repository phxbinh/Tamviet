// components/ThemeToggle.tsx
"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Tránh lỗi hydration: Chỉ render UI sau khi component đã mount
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="p-2 w-9 h-9" />; // Placeholder trống

  return (
    <div className="flex gap-2 p-2 border rounded-lg bg-gray-100 dark:bg-gray-800 w-fit">
      <button 
        onClick={() => setTheme("light")}
        className={`px-3 py-1 rounded ${theme === 'light' ? 'bg-white shadow' : ''}`}
      >
        ☀️ Light
      </button>
      <button 
        onClick={() => setTheme("dark")}
        className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-blue-600 text-white' : ''}`}
      >
        🌙 Dark
      </button>
      <button 
        onClick={() => setTheme("system")}
        className={`px-3 py-1 rounded ${theme === 'system' ? 'bg-gray-300 dark:bg-gray-600' : ''}`}
      >
        💻 System
      </button>
    </div>
  );
}
