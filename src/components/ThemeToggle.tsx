// components/ThemeToggle.tsx
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react"; // Import Icon

export function ThemeToggle_() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Tránh lỗi hydration
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="p-2 w-10 h-10" />; 

  return (
    <div className="flex gap-1 p-1 border rounded-xl bg-muted/50 backdrop-blur-sm w-fit border-border shadow-sm">
      {/* Nút Light */}
      <button 
        onClick={() => setTheme("light")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
          theme === 'light' 
            ? 'bg-white shadow-md text-orange-500' 
            : 'text-muted-foreground hover:bg-gray-200'
        }`}
      >
        <Sun size={16} />
        <span className="text-sm font-medium">Sáng</span>
      </button>

      {/* Nút Dark */}
      <button 
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
          theme === 'dark' 
            ? 'bg-slate-800 shadow-md text-blue-400' 
            : 'text-muted-foreground hover:bg-slate-700/50'
        }`}
      >
        <Moon size={16} />
        <span className="text-sm font-medium">Tối</span>
      </button>

      {/* Nút System */}
      <button 
        onClick={() => setTheme("system")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
          theme === 'system' 
            ? 'bg-gray-200 dark:bg-slate-700 shadow-md text-primary' 
            : 'text-muted-foreground hover:bg-gray-200 dark:hover:bg-slate-700/50'
        }`}
      >
        <Monitor size={16} />
        <span className="text-sm font-medium">Hệ thống</span>
      </button>
    </div>
  );
}





// src/components/ThemeToggle.tsx
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-[120px] h-10" />;

  const modes = [
    { id: 'light', icon: Sun, color: 'text-orange-500' },
    { id: 'dark', icon: Moon, color: 'text-blue-400' },
    { id: 'system', icon: Monitor, color: 'text-neon-purple' },
  ];

  return (
    <div className="flex gap-1">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = theme === mode.id;
        
        return (
          <button
            key={mode.id}
            onClick={() => setTheme(mode.id)}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isActive 
                ? `bg-background shadow-inner ${mode.color}` 
                : 'text-muted-foreground hover:bg-muted'
            }`}
            title={mode.id}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
          </button>
        );
      })}
    </div>
  );
}









