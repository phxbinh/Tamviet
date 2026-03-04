'use client';

import { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

export default function DashboardShell({ 
  children, 
  user 
}: { 
  children: React.ReactNode; 
  user: any 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Sidebar cho Desktop */}
      <div className="hidden md:flex h-full">
        <DashboardSidebar user={user} />
      </div>

      {/* Sidebar cho Mobile (Overlay) */}
      <div className={`
        fixed inset-0 z-50 md:hidden transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="w-64 h-full bg-background shadow-xl">
           <DashboardSidebar user={user} onNavigate={() => setIsSidebarOpen(false)} />
        </div>
        <div 
          className="absolute inset-0 bg-black/50 -z-10" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
