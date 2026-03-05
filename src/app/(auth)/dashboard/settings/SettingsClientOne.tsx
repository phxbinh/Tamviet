'use client';

import React, { useState } from 'react';
import { User, Lock, Palette, ShieldCheck } from 'lucide-react';
import ProfilesTab from './ProfilesTab';
import SecurityTab from './SecurityTab'; // Cái mà mình đã viết ở trên

export default function SettingsClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance'>('profile');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* CỘT TRÁI: MENU NAVIGATION */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-card/40 backdrop-blur-xl border border-border p-2 rounded-2xl sticky top-4">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'profile' 
              ? 'bg-primary/10 text-primary border border-primary/20 shadow-inner' 
              : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
            }`}
          >
            <User size={18} /> Hồ sơ cá nhân
          </button>
          
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'security' 
              ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20 shadow-inner' 
              : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
            }`}
          >
            <Lock size={18} /> Bảo mật
          </button>

          <button 
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              activeTab === 'appearance' 
              ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-inner' 
              : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
            }`}
          >
            <Palette size={18} /> Giao diện
          </button>
        </div>

        {/* Info Card nhỏ bên dưới Menu */}
        <div className="bg-linear-to-br from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/20 p-5 rounded-3xl">
          <div className="flex items-center gap-2 text-neon-cyan mb-3">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Hệ thống bảo vệ</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Dữ liệu cá nhân của bạn được mã hóa và lưu trữ an toàn tại Neon DB Cloud.
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: NỘI DUNG CHI TIẾT */}
      <div className="lg:col-span-2">
        {activeTab === 'profile' && <ProfilesTab user={user} />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'appearance' && (
           <div className="p-12 text-center border border-dashed border-border rounded-3xl text-muted-foreground text-sm">
             Tính năng Giao diện đang được phát triển...
           </div>
        )}
      </div>
    </div>
  );
}
