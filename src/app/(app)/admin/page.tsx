// src/app/(app)/admin/page.tsx
import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  Settings, 
  Layers,
  Zap
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-10 custom-scrollbar">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter uppercase italic flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary animate-breathe-slow" />
            Strategic Command
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium tracking-wide">
            HỆ THỐNG QUẢN TRỊ CHIẾN LƯỢC VÀ TĂNG TRƯỞNG
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="px-4 py-2 border border-border bg-card flex items-center gap-2 rounded-sm shadow-sm">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">System Online</span>
          </div>
          <button className="bg-primary text-white px-6 py-2 rounded-sm hover:opacity-90 transition-all font-bold text-xs uppercase tracking-tighter flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Deploy Updates
          </button>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Tổng người dùng', value: '128,430', growth: '+12.5%', icon: Users },
          { label: 'Doanh thu mục tiêu', value: '$2.4M', growth: '+8.2%', icon: TrendingUp },
          { label: 'Hiệu suất hệ thống', value: '99.9%', growth: 'Stable', icon: Activity },
          { label: 'Tỉ lệ chuyển đổi', value: '18.4%', growth: '+2.1%', icon: Layers },
        ].map((item, i) => (
          <div key={i} className="group p-6 bg-card border border-border hover:border-primary transition-all duration-500 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
              <item.icon className="w-12 h-12 text-primary" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{item.label}</p>
            <h3 className="text-3xl font-bold tracking-tight mb-1">{item.value}</h3>
            <div className="flex items-center gap-1 text-xs font-bold text-neon-cyan">
              <ArrowUpRight className="w-3 h-3" />
              {item.growth} <span className="text-muted-foreground ml-1 font-normal text-[10px]">vs tháng trước</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART PLACEHOLDER / ACTIVITY FEED */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-card border border-border p-8 min-h-[400px] relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] border-l-4 border-primary pl-4">
                Biểu đồ tăng trưởng tham vọng
              </h2>
              <Settings className="w-4 h-4 text-muted-foreground cursor-pointer hover:rotate-90 transition-transform" />
            </div>
            
            {/* Visual representation of a chart using divs */}
            <div className="flex items-end justify-between h-64 gap-2">
              {[40, 55, 45, 70, 85, 65, 95, 100, 80, 90, 110, 120].map((h, i) => (
                <div 
                  key={i} 
                  className="bg-primary/20 hover:bg-primary transition-colors w-full relative group"
                  style={{ height: `${h / 1.5}%` }}
                >
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    {h}%
                   </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4 flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span>Q1 2024</span>
              <span>Hiện tại (Q1 2026)</span>
            </div>
          </section>
        </div>

        {/* SIDEBAR LOGS */}
        <div className="space-y-6">
          <section className="bg-card border border-border p-6 shadow-xl relative">
             <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary animate-breathe-fast" />
                Nhật ký vận hành
             </h2>
             
             <div className="space-y-6">
                {[
                  { time: '02:14:10', msg: 'Backup cơ sở dữ liệu hoàn tất', status: 'success' },
                  { time: '01:45:02', msg: 'Phát hiện truy cập từ IP lạ: 192.168.1.1', status: 'warning' },
                  { time: '00:30:15', msg: 'Cập nhật API Version 4.2', status: 'info' },
                  { time: '23:12:00', msg: 'Hệ thống tự động tối ưu hóa cache', status: 'info' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 group">
                    <span className="text-[10px] font-mono text-muted-foreground pt-1">{log.time}</span>
                    <p className="text-xs font-medium leading-relaxed group-hover:text-primary transition-colors">
                      {log.msg}
                    </p>
                  </div>
                ))}
             </div>

             <button className="w-full mt-8 py-3 border border-border hover:bg-foreground hover:text-background transition-all text-[10px] font-black uppercase tracking-[0.3em]">
                Xem toàn bộ báo cáo
             </button>
          </section>

          {/* AMBITION QUOTE CARD */}
          <div className="p-6 bg-primary text-white flex flex-col justify-between h-48 relative overflow-hidden">
             <div className="z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Vision 2026</p>
                <h3 className="text-xl font-bold leading-tight italic">"Dẫn đầu thị trường bằng sự chính xác tuyệt đối và tốc độ vượt trội."</h3>
             </div>
             <div className="absolute -bottom-4 -right-4 opacity-10">
                <TrendingUp className="w-32 h-32" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
