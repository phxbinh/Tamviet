'use client';

import { Menu, Bell, Search } from 'lucide-react';

export default function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-4 md:px-8 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-foreground/5 rounded-xl">
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-foreground/5 border border-border px-3 py-1.5 rounded-xl w-64 focus-within:border-neon-cyan transition-colors">
          <Search size={14} className="text-muted-foreground" />
          <input type="text" placeholder="Tìm kiếm..." className="bg-transparent border-none outline-none text-xs w-full" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:block text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
          System Operational
        </div>
        <button className="p-2 hover:bg-foreground/5 rounded-xl relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-neon-cyan rounded-full border-2 border-background" />
        </button>
      </div>
    </header>
  );
}