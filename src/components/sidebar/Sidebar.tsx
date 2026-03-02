/*
import SidebarClient from './SidebarClient';
import { sidebarLinks } from './links';

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const visibleLinks = sidebarLinks.filter((l) => l.showInSidebar !== false);

  return (
    <div className="py-4">
      <SidebarClient links={visibleLinks} onNavigate={onNavigate} />
    </div>
  );
}
*/

import SidebarClient from './SidebarClient';
import { sidebarLinks } from './links';

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const visibleLinks = sidebarLinks.filter((l) => l.showInSidebar !== false);

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
        <SidebarClient links={visibleLinks} onNavigate={onNavigate} />
      </div>

      <div className="p-4 border-t border-border/20">
        <div className="p-3 rounded-xl bg-accent/20 border border-border/40">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Auth Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[11px] text-foreground font-medium">Lê Nguyễn</p>
          </div>
        </div>
      </div>
    </div>
  );
}
