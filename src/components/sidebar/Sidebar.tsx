import SidebarClient from './SidebarClient';
import { sidebarLinks } from './links';

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const visibleLinks = sidebarLinks.filter((l) => l.showInSidebar !== false);

  return (
    <aside className="h-full w-full flex flex-col bg-background/50 backdrop-blur-xl border-r border-border/50">
      {/* Header nhỏ bên trong Sidebar nếu cần (Optional) */}
      <div className="p-6">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
          Navigation
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        <SidebarClient links={visibleLinks} onNavigate={onNavigate} />
      </div>

      {/* Footer Sidebar (Version/Status) */}
      <div className="p-4 border-t border-border/30">
        <div className="rounded-xl bg-accent/30 p-3">
          <p className="text-[10px] font-bold text-neon-cyan">SYSTEM ACTIVE</p>
          <p className="text-[9px] text-muted-foreground">Stable Build v1.0.4</p>
        </div>
      </div>
    </aside>
  );
}
