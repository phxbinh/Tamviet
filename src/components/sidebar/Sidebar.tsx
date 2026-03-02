import SidebarClient from './SidebarClient';
import { sidebarLinks } from './links';

type SidebarProps = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
  const visibleLinks = sidebarLinks.filter((l) => l.showInSidebar !== false);

  return (
    <div className="flex flex-col h-full">
      {/* Label nhỏ cho chuyên nghiệp */}
      <div className="p-6 pb-2">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
          Main Menu
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
        <SidebarClient links={visibleLinks} onNavigate={onNavigate} />
      </div>

      {/* Footer Sidebar */}
      <div className="p-4 mt-auto">
        <div className="rounded-xl bg-neon-cyan/5 border border-neon-cyan/10 p-3">
          <p className="text-[10px] font-bold text-neon-cyan uppercase">System Status</p>
          <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">ALL_SYSTEMS_GO</p>
        </div>
      </div>
    </div>
  );
}
