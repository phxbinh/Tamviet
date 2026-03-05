// src/app/(auth)/dashboard/settings/SettingsClient.tsx
'use client';

import { useState } from 'react';
import ProfileTab from './ProfileTab'; // Tách cái Section 1 cũ ra file này
import SecurityTab from './SecurityTab';

export default function SettingsClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance'>('profile');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* CỘT TRÁI: MENU */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-card/40 backdrop-blur-xl border border-border p-2 rounded-2xl">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'profile' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-foreground/5'
            }`}
          >
            <User size={18} /> <span className="text-sm font-semibold">Hồ sơ cá nhân</span>
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'security' ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20' : 'text-muted-foreground hover:bg-foreground/5'
            }`}
          >
            <Lock size={18} /> <span className="text-sm font-semibold">Bảo mật</span>
          </button>
          {/* ... Nút Giao diện tương tự */}
        </div>
      </div>

      {/* CỘT PHẢI: HIỂN THỊ NỘI DUNG THEO TAB */}
      <div className="lg:col-span-2 space-y-6">
        {activeTab === 'profile' && <ProfileTab user={user} />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
}
