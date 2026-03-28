// src/components/layout/PublicShell.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle_";
import { Toast } from "@/components/Toast";
import { Menu, X, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function PublicShell({ children }: { children: React.ReactNode }) {
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

          <div className="ml-auto flex items-center gap-2">
            <Link href="/cart" className="p-2 relative">
              <ShoppingCart size={20} />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan text-[9px] text-black font-bold border-2 border-background">
                0
              </span>
            </Link>
          </div>

          {/* Theme Toggle */}
          <div className="z-[100] scale-75 landscape:scale-75 transition-transform">
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









//export default 
function PublicShell____({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    /* 1. Thay h-svh bằng min-h-svh: Để chiều cao ít nhất bằng màn hình, 
          nhưng vẫn có thể nới rộng nếu con cao hơn.
       2. Bỏ overflow-hidden: Để trang có thể scroll tự nhiên khi thẻ cha dài ra.
       3. Thêm flex-1 cho các phần tử bên trong nếu cần thiết.
    */
    <div className="flex min-h-svh w-full flex-col md:flex-row 
                    landscape:max-w-[800px] landscape:mx-auto 
                    border-3 border-red-500 bg-background">

      {/* SIDEBAR AREA 
          Trên mobile (flex-col): Nó nằm trên.
          Trên desktop (flex-row): Nó nằm trái.
      */}
        {/* SIDEBAR */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 
            bg-card/80 backdrop-blur-2xl border-r border-border
            transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Header của Sidebar */}
          <div className="h-16 landscape:h-12 flex items-center justify-between px-6 border-b border-border transition-all">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <span className="font-bold tracking-tighter text-foreground text-sm uppercase">
                TÂM<span className="text-neon-cyan"> VIỆT</span>
              </span>
            </Link>
            <button 
              onClick={() => setIsOpen(false)} 
              className="lg:hidden p-2 hover:bg-foreground/5 rounded-full"
            >
              <X size={16} />
            </button>
          </div>

          <div className="h-[calc(100vh-4rem)] landscape:h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar">
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </div>
        </aside>



    {/* BACKDROP */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          />
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* HEADER CHÍNH - Nơi chứa icon giỏ hàng bên phải */}
          <header className="sticky top-0 z-30 
                           h-16 landscape:h-12 
                           flex items-center px-4 
                           border-b border-border 
                           bg-background/80 backdrop-blur-md 
                           transition-all duration-300">
            {/* Nút Menu Mobile */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 mr-2 hover:bg-foreground/5 rounded-md"
            >
              <Menu size={20} />
            </button>
            
            {/* Logo nhỏ Mobile */}
            <div className="lg:hidden font-bold text-[10px] tracking-[0.2em] uppercase opacity-50">
              Tâm Việt Platform
            </div>

            {/* Cụm icon góc bên phải */}
            <div className="ml-auto flex items-center gap-2">
              <Link 
                href="/cart" 
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors relative text-foreground/80 hover:text-foreground"
              >
                <ShoppingCart size={20} />
                {/* Badge số lượng sản phẩm */}
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan text-[9px] text-black font-bold border-2 border-background">
                  0
                </span>
              </Link>
            </div>
          </header>
        </div>




      {/* MAIN CONTENT AREA 
          Bỏ overflow-y-auto ở đây vì bây giờ chúng ta muốn cả thẻ cha ngoài cùng 
          cuộn theo nội dung thay vì chỉ cuộn trong main.
      */}
      <main className="mt-16 flex-1 min-w-0 relative p-1 md:p-6 lg:p-12">
        <div className="mx-auto max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}








//export default
function PublicShell_({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>




{/* HEADER CHÍNH: Đã fix UI để chứa ThemeToggle tinh tế */}
<header className="sticky top-0 z-30 
                 h-16 landscape:h-12 
                 flex items-center px-4 
                 border-b border-border 
                 bg-background/80 backdrop-blur-md 
                 transition-all duration-300 w-full">
  
  {/* CỤM BÊN TRÁI: Menu + Logo Mobile */}
  <div className="flex items-center">
    <button
      onClick={() => setIsOpen(true)}
      className="lg:hidden p-2 mr-2 hover:bg-foreground/5 rounded-md transition-all active:scale-90"
    >
      <Menu size={20} />
    </button>
    
    <div className="lg:hidden font-bold text-[10px] tracking-[0.2em] uppercase opacity-50 select-none">
      Tâm Việt Platform
    </div>
  </div>

  {/* CỤM BÊN PHẢI: Giỏ hàng + ThemeToggle */}
  <div className="ml-auto flex items-center gap-1 md:gap-3">
    
    {/* Giỏ hàng */}
    <Link 
      href="/cart" 
      className="p-2 relative hover:bg-foreground/5 rounded-full transition-colors group"
    >
      <ShoppingCart size={20} className="group-hover:text-neon-cyan transition-colors" />
      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan text-[9px] text-black font-bold border-2 border-background">
        0
      </span>
    </Link>

    {/* Phân cách nhẹ (Optional - giúp giao diện Luxury hơn) */}
    <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />

    {/* Theme Toggle: Tự động thu nhỏ khi xoay ngang để không chiếm chỗ */}
    <div className="flex items-center justify-center scale-90 landscape:scale-75 transition-transform origin-right">
      <ThemeToggle />
    </div>

  </div>
</header>



















     <div className="flex min-h-screen bg-background">

        {/* SIDEBAR */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 
            bg-card/80 backdrop-blur-2xl border-r border-border
            transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Header của Sidebar */}
          <div className="h-16 landscape:h-12 flex items-center justify-between px-6 border-b border-border transition-all">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <span className="font-bold tracking-tighter text-foreground text-sm uppercase">
                TÂM<span className="text-neon-cyan"> VIỆT</span>
              </span>
            </Link>
            <button 
              onClick={() => setIsOpen(false)} 
              className="lg:hidden p-2 hover:bg-foreground/5 rounded-full"
            >
              <X size={16} />
            </button>
          </div>

          <div className="h-[calc(100vh-4rem)] landscape:h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar">
            <Sidebar onNavigate={() => setIsOpen(false)} />
          </div>
        </aside>

        {/* BACKDROP */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          />
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* HEADER CHÍNH - Nơi chứa icon giỏ hàng bên phải */}
          <header className="sticky top-0 z-30 
                           h-16 landscape:h-12 
                           flex items-center px-4 
                           border-b border-border 
                           bg-background/80 backdrop-blur-md 
                           transition-all duration-300">
            {/* Nút Menu Mobile */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 mr-2 hover:bg-foreground/5 rounded-md"
            >
              <Menu size={20} />
            </button>
            
            {/* Logo nhỏ Mobile */}
            <div className="lg:hidden font-bold text-[10px] tracking-[0.2em] uppercase opacity-50">
              Tâm Việt Platform
            </div>

            {/* Cụm icon góc bên phải */}
            <div className="ml-auto flex items-center gap-2">
              <Link 
                href="/cart" 
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors relative text-foreground/80 hover:text-foreground"
              >
                <ShoppingCart size={20} />
                {/* Badge số lượng sản phẩm */}
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-cyan text-[9px] text-black font-bold border-2 border-background">
                  0
                </span>
              </Link>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="flex-1 px-1 lg:px-8 pb-10 pt-0">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

        </div>
      </div>

      <Toast />

      {/* Theme Toggle */}
      <div className="fixed bottom-4 right-4 z-[100] landscape:scale-75 transition-transform">
        <ThemeToggle />
      </div>
    </>
  );
}







