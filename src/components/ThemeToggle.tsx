// components/ThemeToggle.tsx
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, ChevronUp, Plus } from "lucide-react";

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
export function ThemeToggle__() {
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


// src/components/ThemeToggle.tsx
export function ThemeToggle___() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const modes = [
    { id: 'system', icon: Monitor, label: 'Hệ thống', color: 'text-purple-400' },
    { id: 'dark', icon: Moon, label: 'Tối', color: 'text-blue-400' },
    { id: 'light', icon: Sun, label: 'Sáng', color: 'text-orange-400' },
  ];

  // Lấy icon của theme hiện tại để hiển thị nút chính
  const CurrentIcon = modes.find(m => m.id === theme)?.icon || Monitor;

  return (
    <div className="relative flex flex-col items-center gap-3">
      {/* MENU CỘT - Chạy từ dưới lên */}
      <div 
        className={`flex flex-col gap-3 transition-all duration-300 ease-out transform ${
          isOpen 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-10 scale-50 pointer-events-none"
        }`}
      >
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              setTheme(mode.id);
              setIsOpen(false);
            }}
            className={`group relative flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border shadow-lg hover:border-neon-cyan transition-all ${
              theme === mode.id ? "ring-2 ring-neon-cyan/50" : ""
            }`}
          >
            <mode.icon size={20} className={mode.color} />
            {/* Tooltip hiện tên khi hover */}
            <span className="absolute right-14 px-2 py-1 rounded bg-popover text-xs border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {mode.label}
            </span>
          </button>
        ))}
      </div>

      {/* NÚT TRIGGER CHÍNH */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-2xl ${
          isOpen 
            ? "bg-neon-cyan border-neon-cyan text-black rotate-180 shadow-[0_0_20px_rgba(34,211,238,0.6)]" 
            : "bg-card border-border text-foreground hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
        }`}
      >
        {isOpen ? <ChevronUp size={28} /> : <CurrentIcon size={28} />}
      </button>
    </div>
  );
}





// src/components/ThemeToggle.tsx
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
      {/* MENU CỘT - Thu nhỏ kích thước và khoảng cách */}
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
            
            {/* Tooltip nhỏ gọn bên trái */}
            <span className="absolute right-12 px-2 py-0.5 rounded-md bg-popover text-[10px] font-medium border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              {mode.label}
            </span>
          </button>
        ))}
      </div>

      {/* NÚT TRIGGER CHÍNH - Thu nhỏ từ 14 xuống 10 (w-10 h-10) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 shadow-lg ${
          isOpen 
            ? "bg-neon-cyan border-neon-cyan text-black rotate-45 shadow-[0_0_15px_rgba(34,211,238,0.5)]" 
            : "bg-card/80 backdrop-blur-md border-border text-foreground hover:border-neon-cyan/50"
        }`}
      >
        {/* Dùng icon Plus xoay 45 độ sẽ thành dấu X khi mở, nhìn rất hiện đại */}
        {isOpen ? <Plus size={20} /> : <CurrentIcon size={18} />}
      </button>
    </div>
  );
}






