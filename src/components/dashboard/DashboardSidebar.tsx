'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckCircle2, Calendar, Settings, LogOut, Zap, ShieldCheck, ChevronLeft } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { signOut } from '@/lib/authActions/auth';

interface DashboardSidebarProps {
  user: any; 
  onNavigate?: () => void; // Thêm dòng này, dấu '?' nghĩa là không bắt buộc
}

export default function DashboardSidebar({ user, onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tổng quan', href: '/dashboard' },
    { icon: CheckCircle2, label: 'Nhiệm vụ', href: '/dashboard/tasks' },
    { icon: Calendar, label: 'Lịch biểu', href: '/dashboard/calendar' },
    { icon: Calendar, label: 'Lịch multi day', href: '/dashboard/multiday' },
    { icon: Settings, label: 'Cài đặt', href: '/dashboard/settings' },
  ];

  return (
    <aside className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border w-64 transition-all duration-300">
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-lg shadow-neon-cyan/20">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <span className="font-bold tracking-tighter text-lg">
            TÂM<span className="text-neon-cyan"> VIỆT</span>
          </span>
        </Link>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              onClick={() => onNavigate?.()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-foreground/5'}
              `}
            >
              <item.icon size={18} className={isActive ? 'text-neon-cyan' : ''} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* USER SECTION */}
      <div className="p-4 mt-auto border-t border-border">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-foreground/5 border border-border">
            <UserAvatar email={user?.email || ''} avatarUrl={user?.avatar_url} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.email?.split('@')[0] || 'Guest'}</p>
              <div className="flex items-center gap-1 text-[9px] uppercase font-bold text-muted-foreground">
                <ShieldCheck size={10} className="text-neon-cyan" /> {user?.role || 'user'}
              </div>
            </div>
          </div>
          <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut size={16} /> Đăng xuất
          </button>
          {/* BACK TO APP LINK - UI SYNCED */}
          <Link 
            href="/"
            onClick={() => onNavigate?.()}
            className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </aside>
  );
}


























