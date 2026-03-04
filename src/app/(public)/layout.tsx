// src/app/(public)/layout.tsx

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>          <div className="flex h-full w-full overflow-hidden bg-background">
            
            {/* CỘT 1: SIDEBAR */}
            <aside className={`
              fixed md:relative inset-y-0 left-0 z-50 w-64 border-r border-border bg-card/50 backdrop-blur-xl
              transition-transform duration-300 ease-in-out shrink-0 flex flex-col
              ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}>
              <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
                <Link
                  href="/"
                >
                  <span className="font-bold tracking-tighter">TÂM<span className="text-neon-cyan"> VIỆT</span></span> </Link>
                <button onClick={() => setIsOpen(false)} className="md:hidden p-2"><X size={18}/></button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <Sidebar onNavigate={() => setIsOpen(false)} />
              </div>
            </aside>

            {/* BACKDROP MOBILE */}
            {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-40 md:hidden" />}

            {/* CỘT 2: CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
              
              {/* Header: Fix Top của cột 2, không bao giờ scroll */}
              <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center px-4 shrink-0 z-10">
                <button onClick={() => setIsOpen(true)} className="md:hidden p-2 mr-2 hover:bg-accent rounded-lg">
                  <Menu size={22} />
                </button>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 hidden sm:block">System Terminal</div>
              </header>

              {/* VÙNG CUỘN CHÍNH: Đây là nơi DUY NHẤT có thanh scroll */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col bg-transparent">
                
                {/* Main Content */}
                <main className="flex-1 p-2 md:p-8 w-full max-w-6xl mx-auto shrink-0">
                  {children}
                </main>

                {/* Footer: Nằm cuối luồng cuộn */}
                <footer className="mt-auto py-4 border-t border-border/40 px-6 shrink-0 text-center md:text-left">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    © 2026 Tâm Việt — All Systems Operational
                  </p>
                </footer>

              </div>
            </div>
          </div>

          <Toast />
          <div className="fixed bottom-6 right-6 z-50"><ThemeToggle /></div>

        </>;
}