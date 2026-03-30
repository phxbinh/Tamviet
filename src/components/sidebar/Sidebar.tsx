// src/components/sidebar/Sidebar.tsx
import SidebarClient from './SidebarClient';
import { sidebarLinks } from './links';
import {ThemeToggle} from '@/components/ThemeToggle_';

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const visibleLinks = sidebarLinks.filter((l) => l.showInSidebar !== false);

  return (
    <div className="py-4 z-50">
      <SidebarClient links={visibleLinks} onNavigate={onNavigate} />
      <ThemeToggle/>
    </div>
  );
}