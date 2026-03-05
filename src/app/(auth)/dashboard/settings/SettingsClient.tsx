'use client';

import React, { useState } from 'react';
import { UserAvatar } from '@/components/dashboard/UserAvatar';
import { User, Lock, Palette, Bell, Save, Camera, ShieldCheck } from 'lucide-react';

export default function SettingsClient({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* CỘT TRÁI: DANH MỤC CÀI ĐẶT (Tabs giả lập) */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-card/40 backdrop-blur-xl border border-border p-2 rounded-2xl">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all">
            <User size={18} />
            <span className="text-sm font-semibold">Hồ sơ cá nhân</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-foreground/5 transition-all">
            <Lock size={18} />
            <span className="text-sm font-semibold">Bảo mật</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-foreground/5 transition-all">
            <Palette size={18} />
            <span className="text-sm font-semibold">Giao diện</span>
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-linear-to-br from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/20 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-neon-cyan mb-2">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Trạng thái bảo vệ</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tài khoản của bạn đang được bảo vệ bởi hệ thống xác thực Supabase & Neon RLS.
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: CHI TIẾT CÀI ĐẶT */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* SECTION 1: PROFILE */}
        <section className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between bg-white/5">
            <h2 className="font-bold flex items-center gap-2">
              <User size={18} className="text-neon-cyan" />
              Thông tin cơ bản
            </h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-xs font-bold hover:scale-105 transition-all active:scale-95">
              <Save size={14} /> Lưu thay đổi
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Avatar Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <UserAvatar email={user?.email} avatarUrl={user?.avatar_url} size="lg" />
                <button className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={20} className="text-white" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-lg">Ảnh đại diện</h3>
                <p className="text-xs text-muted-foreground">Khuyên dùng ảnh 256x256px. Định dạng JPG, PNG.</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email hệ thống</label>
                <input 
                  type="email" 
                  disabled 
                  value={user?.email} 
                  className="w-full bg-foreground/5 border border-border px-4 py-3 rounded-xl text-sm opacity-60 cursor-not-allowed" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Vai trò</label>
                <div className="w-full bg-foreground/5 border border-border px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <ShieldCheck size={14} className="text-neon-cyan" />
                  <span className="capitalize">{user?.role}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Tên hiển thị</label>
                <input 
                  type="text" 
                  placeholder="Nhập tên của bạn..." 
                  className="w-full bg-background border border-border px-4 py-3 rounded-xl text-base md:text-sm focus:border-neon-cyan outline-none transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Số điện thoại</label>
                <input 
                  type="text" 
                  placeholder="+84..." 
                  className="w-full bg-background border border-border px-4 py-3 rounded-xl text-base md:text-sm focus:border-neon-cyan outline-none transition-colors" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: DANGER ZONE */}
        <section className="border border-red-500/20 bg-red-500/5 rounded-3xl p-6">
          <h3 className="text-red-500 font-bold text-sm mb-2 uppercase tracking-tighter">Vùng nguy hiểm</h3>
          <p className="text-xs text-muted-foreground mb-4">Một khi đã xóa tài khoản, mọi dữ liệu về nhiệm vụ và lịch biểu sẽ biến mất vĩnh viễn.</p>
          <button className="px-4 py-2 border border-red-500/50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all">
            Xóa vĩnh viễn tài khoản
          </button>
        </section>
      </div>
    </div>
  );
}
