// src/components/ThemeToggle.tsx
/*
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, ChevronUp, Plus } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const modes = [
    { id: 'system', icon: Monitor, label: 'OS', color: 'text-purple-400' },
    { id: 'dark', icon: Moon, label: 'Dark', color: 'text-blue-400' },
    { id: 'light', icon: Sun, label: 'Light', color: 'text-orange-400' },
  ];

  const CurrentIcon = modes.find(m => m.id === theme)?.icon || Monitor;

  return (
    <div className="relative flex flex-col items-center">
      
      <div 
        className={`flex flex-col gap-2 mb-3 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isOpen 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-4 scale-75 pointer-events-none"
        }`}
      >
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              setTheme(mode.id);
              setIsOpen(false);
            }}
            className={`group relative flex items-center justify-center w-9 h-9 rounded-full bg-card/90 backdrop-blur-md border border-border shadow-sm hover:border-neon-cyan transition-all ${
              theme === mode.id ? "bg-accent border-neon-cyan/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]" : ""
            }`}
          >
            <mode.icon size={16} className={mode.color} />
            
            
            <span className="absolute right-12 px-2 py-0.5 rounded-md bg-popover text-[10px] font-medium border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              {mode.label}
            </span>
          </button>
        ))}
      </div>

      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 shadow-lg ${
          isOpen 
            ? "bg-neon-cyan border-neon-cyan text-black rotate-45 shadow-[0_0_15px_rgba(34,211,238,0.5)]" 
            : "bg-card/80 backdrop-blur-md border-border text-foreground hover:border-neon-cyan/50"
        }`}
      >
        
        {isOpen ? <Plus size={20} /> : <CurrentIcon size={18} />}
      </button>
    </div>
  );
}
*/


"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Plus } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  
  // Tránh lỗi Hydration bằng cách không render gì cho đến khi mounted
  if (!mounted) return <div className="w-10 h-10" />; 

  const modes = [
    { id: 'system', icon: Monitor, label: 'OS', color: 'text-purple-500 dark:text-purple-400' },
    { id: 'dark', icon: Moon, label: 'Dark', color: 'text-blue-500 dark:text-blue-400' },
    { id: 'light', icon: Sun, label: 'Light', color: 'text-orange-500 dark:text-orange-400' },
  ];

  const currentMode = modes.find(m => m.id === theme) || modes[0];
  const CurrentIcon = currentMode.icon;

  return (
    // Thêm bg-transparent để chắc chắn không có khung nền trắng ở thẻ cha
    <div className="relative flex flex-col items-center bg-transparent select-none">
      
      {/* MENU CỘT */}
      <div 
        className={`flex flex-col gap-2 mb-3 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isOpen 
            ? "opacity-100 translate-y-0 scale-100 visible" 
            : "opacity-0 translate-y-6 scale-50 invisible pointer-events-none"
        }`}
      >
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => {
              setTheme(mode.id);
              setIsOpen(false);
            }}
            // Tinh chỉnh bg-card/80 và border-border/50 để nó thanh thoát hơn trong Light Mode
            className={`group relative flex items-center justify-center w-9 h-9 rounded-full 
              bg-card/80 dark:bg-card/90 backdrop-blur-lg border border-border/60 
              shadow-sm transition-all hover:scale-110 active:scale-95
              ${theme === mode.id ? "ring-2 ring-neon-cyan/50 border-neon-cyan" : "hover:border-neon-cyan/50"}
            `}
          >
            <mode.icon size={16} className={mode.color} />
            
            {/* Tooltip */}
            <span className="absolute right-12 px-2 py-1 rounded-md bg-popover/90 backdrop-blur-md text-[10px] font-bold border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none">
              {mode.label}
            </span>
          </button>
        ))}
      </div>

      {/* NÚT TRIGGER CHÍNH */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        // Loại bỏ focus outline mặc định của trình duyệt gây ra khung hình chữ nhật
        className={`w-10 h-10 rounded-full flex items-center justify-center border outline-none focus:outline-none transition-all duration-500 shadow-lg ${
          isOpen 
            ? "bg-neon-cyan border-neon-cyan text-black rotate-45 shadow-[0_0_20px_rgba(34,211,238,0.4)]" 
            : "bg-card/90 dark:bg-card/80 backdrop-blur-xl border-border/80 text-foreground hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
        }`}
      >
        {isOpen ? <Plus size={22} strokeWidth={2.5} /> : <CurrentIcon size={18} />}
      </button>
    </div>
  );
}






