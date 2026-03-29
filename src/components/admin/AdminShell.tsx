

"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle_";
import { Toast } from "@/components/Toast";
import { Menu, X, ShoppingCart } from "lucide-react";
import Link from "next/link";

//import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';



//export default
function AdminShell_({ 
  children, 
  user 
}: { 
  children: React.ReactNode; 
  user: any 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-svh w-full flex-col lg:flex-row 
                    landscape:max-w-[800px] landscape:mx-auto 
                    border-3 border-red-500 bg-background relative">
      {/* Sidebar cho Desktop */}
      <div className="hidden md:flex h-full">
        <AdminSidebar user={user} />
      </div>

      {/* Sidebar cho Mobile (Overlay) */}
      <div className={`
        fixed inset-0 z-50 md:hidden transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="w-64 h-full bg-background shadow-xl">
           <AdminSidebar user={user} onNavigate={() => setIsSidebarOpen(false)} />
        </div>
        <div 
          className="absolute inset-0 bg-black/50 -z-10" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      </div>

      {/* 2. KHỐI NỘI DUNG CHÍNH (Gồm Header + Main) */}
      <div className="flex-1 flex flex-col min-w-0 w-full relative">
        
        {/* HEADER CHÍNH: Bây giờ nó sẽ sticky dựa trên thẻ div cha này */}
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* MAIN: Nằm ngay dưới Header trong cùng một Flex-col */}
        <main className="flex-1 min-w-0 p-1 md:p-6 lg:p-12 bg-background">
          <div className="mx-auto max-w-full">
            {children}
          </div>
        </main>

        <footer className="p-4 border-t border-border text-center text-[10px] opacity-40 uppercase tracking-widest">
            © 2026 Tâm Việt Platform
        </footer>
      </div>
    </div>
  );
}

/*
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
*/




//export default
function PublicShell_({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-svh w-full flex-col lg:flex-row 
                    landscape:max-w-[800px] landscape:mx-auto 
                    border-3 border-red-500 bg-background relative">

      {/* 1. SIDEBAR: Giữ nguyên logic Drawer/Relative */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 
          bg-card/80 backdrop-blur-2xl border-r border-border
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-16 landscape:h-12 flex items-center justify-between px-6 border-b border-border">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <span className="font-bold tracking-tighter text-sm uppercase">
              TÂM<span className="text-neon-cyan"> VIỆT</span>
            </span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2">
            <X size={16} />
          </button>
        </div>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          <Sidebar onNavigate={() => setIsOpen(false)} />
        </div>
      </aside>

      {/* BACKDROP */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* 2. KHỐI NỘI DUNG CHÍNH (Gồm Header + Main) */}
      <div className="flex-1 flex flex-col min-w-0 w-full relative">
        
        {/* HEADER CHÍNH: Bây giờ nó sẽ sticky dựa trên thẻ div cha này */}
        <header className="sticky top-0 z-30 
                         h-16 landscape:h-12 
                         flex items-center px-4 
                         border-b border-border 
                         bg-background/80 backdrop-blur-md 
                         transition-all duration-300 w-full">
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 mr-2 hover:bg-foreground/5 rounded-md"
          >
            <Menu size={20} />
          </button>
          
          <div className="lg:hidden font-bold text-[10px] tracking-[0.2em] uppercase opacity-50">
            Tâm Việt Platform
          </div>

          <div className="ml-auto mr-4 flex items-center gap-2">
            <Link href="/cart" className="p-2 relative">
              <ShoppingCart size={20} />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan text-[9px] text-black font-bold border-2 border-background">
                0
              </span>
            </Link>
          </div>

          {/* Theme Toggle */}
          <div className="z-[100] scale-80 landscape:scale-80 transition-transform">
            <ThemeToggle />
          </div>

        </header>

        {/* MAIN: Nằm ngay dưới Header trong cùng một Flex-col */}
        <main className="flex-1 min-w-0 p-1 md:p-6 lg:p-12 bg-background">
          <div className="mx-auto max-w-full">
            {children}
          </div>
        </main>

        <footer className="p-4 border-t border-border text-center text-[10px] opacity-40 uppercase tracking-widest">
            © 2026 Tâm Việt Platform
        </footer>

      </div>
      <Toast />
    </div>
  );
}



// FILE SỐ 1: AdminShell.tsx
/*
"use client";

import { useState } from "react";
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
*/


export default function AdminShell({ 
  children, 
  user 
}: { 
  children: React.ReactNode; 
  user: any 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background relative overflow-hidden">
      
      {/* SIDEBAR CHO DESKTOP (Luôn hiện trên lg) */}
      <div className="hidden lg:flex h-screen sticky top-0">
        <AdminSidebar user={user} />
      </div>

      {/* SIDEBAR CHO MOBILE (Overlay + Drawer) */}
      <div className={`
        fixed inset-0 z-[100] lg:hidden transition-opacity duration-300
        ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}>
        {/* Lớp nền mờ (Backdrop) */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)} 
        />
        
        {/* Nội dung Sidebar trượt ra */}
        <div className={`
          absolute left-0 top-0 h-full w-64 transition-transform duration-300 ease-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
           <AdminSidebar user={user} onNavigate={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      {/* KHỐI NỘI DUNG CHÍNH */}
      <div className="flex-1 flex flex-col min-w-0 w-full relative">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-10 bg-background">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <footer className="p-4 border-t border-border text-center text-[10px] opacity-40 uppercase tracking-widest">
            © 2026 Tâm Việt Platform
        </footer>
      </div>
    </div>
  );
}











