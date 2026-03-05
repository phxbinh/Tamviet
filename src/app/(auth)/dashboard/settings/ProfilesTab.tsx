'use client';

import React from 'react';
import { UserAvatar } from '@/components/dashboard/UserAvatar';
import { User, Save, Camera, ShieldCheck } from 'lucide-react';

interface ProfilesTabProps {
  user: any;
}

export default function ProfilesTab({ user }: ProfilesTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* SECTION 1: THÔNG TIN CƠ BẢN */}
      <section className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between bg-white/5">
          <h2 className="font-bold flex items-center gap-2">
            <User size={18} className="text-neon-cyan" />
            Thông tin cơ bản
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-xs font-bold hover:scale-105 transition-all active:scale-95 shadow-lg">
            <Save size={14} /> Lưu thay đổi
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Avatar Upload */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group cursor-pointer">
              <UserAvatar email={user?.email} avatarUrl={user?.avatar_url} size="lg" />
              <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border border-neon-cyan/50">
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h3 className="font-bold text-lg">Ảnh đại diện</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Khuyên dùng ảnh 256x256px. <br />
                Định dạng JPG, PNG hoặc WebP.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email - Disabled */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email hệ thống</label>
              <input 
                type="email" 
                disabled 
                value={user?.email || ''} 
                className="w-full bg-foreground/5 border border-border px-4 py-3 rounded-xl text-base md:text-sm opacity-60 cursor-not-allowed outline-none" 
              />
            </div>

            {/* Role - Read Only */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Vai trò</label>
              <div className="w-full bg-foreground/5 border border-border px-4 py-3 rounded-xl text-base md:text-sm flex items-center gap-2 text-muted-foreground/80">
                <ShieldCheck size={14} className="text-neon-cyan" />
                <span className="capitalize font-medium">{user?.role || 'user'}</span>
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Tên hiển thị</label>
              <input 
                type="text" 
                placeholder="Nhập tên của bạn..." 
                className="w-full bg-background border border-border px-4 py-3 rounded-xl text-base md:text-sm focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 outline-none transition-all" 
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Số điện thoại</label>
              <input 
                type="text" 
                placeholder="+84..." 
                className="w-full bg-background border border-border px-4 py-3 rounded-xl text-base md:text-sm focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 outline-none transition-all" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: DANGER ZONE */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-3xl p-6 transition-colors hover:bg-red-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-red-500 font-bold text-sm uppercase tracking-tighter">Vùng nguy hiểm</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Một khi đã xóa tài khoản, mọi dữ liệu về nhiệm vụ và lịch biểu sẽ biến mất vĩnh viễn.
            </p>
          </div>
          <button className="px-6 py-2.5 border border-red-500/50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all shrink-0">
            Xóa vĩnh viễn tài khoản
          </button>
        </div>
      </section>
    </div>
  );
}
