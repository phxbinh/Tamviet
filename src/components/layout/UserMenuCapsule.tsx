"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { UserAvatar } from '@/components/dashboard/UserAvatar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface UserMenuProps {
  user: any;
}

export const UserMenuCapsule = ({ user }: UserMenuProps) => {
  const isLoggedIn = !!user?.email;

  return (
    <DropdownMenu.Root>
      {/* Trigger: Phần capsule bạn đã thiết kế */}
      <DropdownMenu.Trigger asChild>
        <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-secondary/50 border border-border/50 hover:border-neon-cyan/30 transition-all cursor-pointer outline-none group">
          <div className="ring-2 ring-background rounded-full overflow-hidden transition-transform group-active:scale-95">
            <UserAvatar email={user?.email || ''} avatarUrl={user?.avatar_url} size="sm" />
          </div>
          
          <div className="sm:flex flex-col justify-center max-w-[100px]">
            <span className="text-[11px] font-semibold leading-tight truncate">
              {user?.email?.split('@')[0] || 'Guest'}
            </span>
            <div className="flex items-center gap-1 opacity-70">
              {user?.role && (<ShieldCheck size={10} className="text-neon-cyan" />)}
              <span className="text-[8px] uppercase font-bold tracking-tighter">
                {user?.role || 'Guest Mode'}
              </span>
            </div>
          </div>
        </div>
      </DropdownMenu.Trigger>

      {/* Menu Content */}
      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          align="end" 
          sideOffset={8}
          className="z-[100] min-w-[160px] overflow-hidden rounded-xl border border-border bg-card/95 backdrop-blur-xl p-1 shadow-xl animate-in fade-in zoom-in duration-200"
        >
          {!isLoggedIn ? (
            <>
              <DropdownMenu.Item asChild>
                <Link href="/login" className="flex items-center gap-2 px-3 py-2 text-xs font-medium outline-none hover:bg-neon-cyan/10 hover:text-neon-cyan rounded-lg transition-colors cursor-pointer">
                  <LogIn size={14} /> Đăng nhập
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <Link href="/register" className="flex items-center gap-2 px-3 py-2 text-xs font-medium outline-none hover:bg-neon-cyan/10 hover:text-neon-cyan rounded-lg transition-colors cursor-pointer">
                  <UserPlus size={14} /> Đăng ký
                </Link>
              </DropdownMenu.Item>
            </>
          ) : (
            <>
              <DropdownMenu.Item asChild>
                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-xs font-medium outline-none hover:bg-neon-cyan/10 hover:text-neon-cyan rounded-lg transition-colors cursor-pointer">
                  <User size={14} /> Tài khoản
                </Link>
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="h-px bg-border my-1" />
              
              <DropdownMenu.Item 
                onClick={() => {/* Gọi hàm logout của bạn ở đây */}}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium outline-none hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut size={14} /> Đăng xuất
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
