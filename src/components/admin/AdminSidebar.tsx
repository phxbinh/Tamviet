
/*
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Boxes, Box, Tag, Settings, LogOut, Zap, ShieldCheck, ChevronLeft, ChartArea } from 'lucide-react';
import { UserAvatar } from '../dashboard/UserAvatar';
import { signOut } from '@/lib/authActions/auth';



import { 
  LayoutDashboard, // Tổng quan
  UserCircle,      // Profiles
  Layers,          // Product types
  Package,         // Products
  Beaker,          // Product test
  FolderTree,      // Categories
  Fingerprint,     // Attributes
  TableProperties, // Product type attributes
  GitBranch,       // Product variants
  FileText,        // Details all products
  Settings2        // Cài đặt
} from 'lucide-react';
*/

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LogOut, Zap, ShieldCheck, ChevronLeft, LayoutDashboard, BadgeCheck,
  UserCircle, Layers, Package, Beaker, FolderTree, 
  Fingerprint, TableProperties, GitBranch, FileText, Settings2, Box 
} from 'lucide-react';
import { UserAvatar } from '../dashboard/UserAvatar';
import { signOut } from '@/lib/authActions/auth';

interface AdminSidebarProps {
  user: any; 
  onNavigate?: () => void;
}

export default function AdminSidebar({ user, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tổng quan', href: '/admin' },
    { icon: UserCircle, label: 'Profiles', href: '/admin/profiles' },
    { icon: Layers, label: 'Product types', href: '/admin/product-types' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: Beaker, label: 'Product test', href: '/admin/product-test' },
    { icon: FolderTree, label: 'Categories', href: '/admin/categories' },
    { icon: Fingerprint, label: 'Attributes', href: '/admin/attributes' },
    { icon: TableProperties, label: 'Product type attributes', href: '/admin/product-type-attributes' },
    { icon: GitBranch, label: 'Product variants', href: '/admin/product-variants' },
    { icon: FileText, label: 'Details all products', href: '/admin/product-details' },
    { icon: BadgeCheck, label: 'Healthy order cart', href: '/admin/order-cart' },
    { icon: Settings2, label: 'Cài đặt', href: '/admin/setting' },
    { icon: Box, label: 'Post', href: '/admin/posts/new' },
    { icon: Box, label: 'ChatbotPolicies', href: '/admin/chatbotPolicies' },
    { icon: Box, label: 'chatbov1', href: '/admin/chatbotv1-admin' },
    { icon: Box, label: 'productchatbot', href: '/admin/chatbotproduct' },
  ];

  return (
/*      <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 
          bg-card/80 backdrop-blur-2xl border-r border-border
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}>*/
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
            <Link key={item.href} href={item.href} prefetch={true}
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
            href="/" prefetch={true}
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


// FILE SỐ 2: AdminSidebar.tsx
/*
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LogOut, Zap, ShieldCheck, ChevronLeft, LayoutDashboard, 
  UserCircle, Layers, Package, Beaker, FolderTree, 
  Fingerprint, TableProperties, GitBranch, FileText, Settings2 
} from 'lucide-react';
import { UserAvatar } from '../dashboard/UserAvatar';
import { signOut } from '@/lib/authActions/auth';

interface AdminSidebarProps {
  user: any; 
  onNavigate?: () => void;
}
*/

//export default 
function AdminSidebar_({ user, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tổng quan', href: '/admin' },
    { icon: UserCircle, label: 'Profiles', href: '/admin/profiles' },
    { icon: Layers, label: 'Product types', href: '/admin/product-types' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: Beaker, label: 'Product test', href: '/admin/product-test' },
    { icon: FolderTree, label: 'Categories', href: '/admin/categories' },
    { icon: Fingerprint, label: 'Attributes', href: '/admin/attributes' },
    { icon: TableProperties, label: 'Product type attributes', href: '/admin/product-type-attributes' },
    { icon: GitBranch, label: 'Product variants', href: '/admin/product-variants' },
    { icon: FileText, label: 'Details all products', href: '/admin/product-details' },
    { icon: Settings2, label: 'Cài đặt', href: '/admin/setting' },
  ];

  return (
    // Bỏ các class fixed/translate ở đây để Component Cha (Số 1) kiểm soát
    <aside className="flex flex-col h-full w-64 bg-card/80 backdrop-blur-2xl border-r border-border">
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <span className="font-bold tracking-tighter text-lg">
            TÂM<span className="text-cyan-400"> VIỆT</span>
          </span>
        </Link>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={() => onNavigate?.()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-foreground/5'}
              `}
            >
              <item.icon size={18} className={isActive ? 'text-cyan-400' : ''} />
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
                <ShieldCheck size={10} className="text-cyan-400" /> {user?.role || 'user'}
              </div>
            </div>
          </div>
          <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
}



