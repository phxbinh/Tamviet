'use client';

import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  Check, 
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';

// --- INTERFACE CHUẨN DB ---
export interface DailyReportItem {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  startTime: string; 
  endTime: string;   
  status: 'pending' | 'in_progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  adminComment?: string;
  isApproved: boolean;
  tags?: string[];
}

const MOCK_DAILY_REPORTS: DailyReportItem[] = [
  {
    id: 'rpt-01',
    userId: 'u1',
    userName: 'Tâm Việt Admin',
    title: 'Nghiên cứu thị trường AI',
    description: 'Phân tích đối thủ cạnh tranh mảng giáo dục kỹ năng sống.',
    startTime: '08:00',
    endTime: '10:00',
    status: 'done',
    priority: 'medium',
    progress: 100,
    isApproved: true,
    adminComment: 'Dữ liệu rất tốt, cần bổ sung thêm phần dự báo tài chính.',
  },
  {
    id: 'rpt-02',
    userId: 'u1',
    userName: 'Tâm Việt Admin',
    title: 'Thiết kế Dashboard Task',
    description: 'Hoàn thiện giao diện Schedule với hệ thống theme và nhịp thở.',
    startTime: '10:30',
    endTime: '12:30',
    status: 'in_progress',
    priority: 'urgent',
    progress: 65,
    isApproved: false,
    adminComment: 'Cần đẩy nhanh Animation để kịp buổi Demo.',
  }
];

export default function DailyReportSchedule({ selectedDate }: { selectedDate: Date }) {
  
  const getPriorityClasses = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-muted-foreground bg-foreground/5 border-border';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card text-foreground rounded-[3rem] p-8 border border-border shadow-2xl transition-all duration-300 custom-scrollbar overflow-y-auto max-h-screen">
      
      {/* HEADER: Đúng style ảnh mẫu */}
      <div className="flex justify-between items-center mb-10">
        <button className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center border border-border hover:bg-foreground/10 transition-all">
          <LayoutGrid size={20} />
        </button>
        <div className="text-center">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">September</p>
          <h2 className="text-2xl font-black tracking-tight">Today</h2>
        </div>
        <div className="w-12" /> {/* Để cân bằng layout */}
      </div>

      {/* DATE PICKER MINI */}
      <div className="flex justify-between mb-12 px-2">
        {[3, 4, 5, 6, 7].map((d) => (
          <div key={d} className={`flex flex-col items-center gap-2 group cursor-pointer`}>
            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
              {['S','M','T','W','T'][d-3]}
            </span>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all
              ${d === 6 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-foreground/5'}
            `}>
              {d}
            </div>
            {d === 7 && <div className="w-1 h-1 rounded-full bg-primary/40" />}
          </div>
        ))}
      </div>

      {/* TIMELINE LIST */}
      <div className="relative">
        <div className="absolute left-[3.45rem] top-0 bottom-0 w-[1px] bg-border/60" />

        <div className="space-y-6">
          {MOCK_DAILY_REPORTS.map((item) => {
            const isDone = item.status === 'done';
            const isUrgent = item.priority === 'urgent' && !isDone;

            return (
              <div key={item.id} className="relative flex items-start gap-8 group">
                
                {/* Time Label */}
                <div className="w-10 pt-4 text-right">
                  <span className="text-[11px] font-bold text-muted-foreground/40 tabular-nums">
                    {item.startTime}
                  </span>
                </div>

                {/* Status Dot (Timeline Anchor) */}
                <div className="relative z-10 pt-[1.15rem]">
                   <div className={`w-4 h-4 rounded-full border-2 bg-card transition-all duration-500 
                      ${isDone ? 'bg-primary border-primary' : isUrgent ? 'border-red-500 animate-breathe-danger' : 'border-border'}`} 
                    />
                </div>

                {/* TASK CARD: Fix thanh đỏ nằm TRONG thẻ */}
                <div className={`flex-1 rounded-[2rem] transition-all duration-300 border overflow-hidden
                  ${isDone 
                    ? 'bg-foreground/[0.02] border-transparent opacity-50' 
                    : 'bg-card border-border shadow-sm hover:shadow-md'
                  }
                `}>
                  {/* THANH CẢNH BÁO: Nằm sát mép trên bên TRONG thẻ */}
                  {isUrgent && (
                    <div className="w-full h-1.5 bg-red-600 shadow-[0_2px_10px_rgba(220,38,38,0.3)]" />
                  )}

                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-primary tracking-tight flex items-center gap-1.5">
                          <Clock size={14} /> {item.startTime} — {item.endTime}
                        </span>
                        {isUrgent && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded bg-red-500/10 text-red-600 border border-red-500/20 uppercase tracking-tighter">
                            URGENT
                          </span>
                        )}
                      </div>
                      {item.isApproved && <CheckCircle2 size={16} className="text-emerald-500" />}
                    </div>

                    <h4 className={`text-xl font-bold tracking-tight mb-2 ${isDone ? 'line-through' : ''}`}>
                      {item.title}
                    </h4>
                    
                    <p className="text-[13px] text-muted-foreground leading-relaxed mb-6 font-medium">
                      {item.description}
                    </p>

                    {/* Admin Feedback Section */}
                    {item.adminComment && (
                      <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3 items-start">
                        <MessageSquare size={14} className="text-primary mt-1" />
                        <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Admin Feedback</p>
                          <p className="text-[12px] italic opacity-80 leading-relaxed font-medium">"{item.adminComment}"</p>
                        </div>
                      </div>
                    )}

                    {/* Progress & Avatar Team */}
                    <div className="pt-5 border-t border-border flex items-center justify-between">
                      <div className="flex-1 max-w-[180px]">
                        <div className="flex justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tiến độ</span>
                          <span className="text-[11px] font-black text-primary">{item.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${isDone ? 'bg-emerald-500' : 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]'}`}
                            style={{ width: `${item.progress}%` }} 
                          />
                        </div>
                      </div>
                      
                      <div className="flex -space-x-2">
                         <div className="w-7 h-7 rounded-full bg-neon-cyan border-2 border-card flex items-center justify-center text-[9px] font-black text-white shadow-sm">TV</div>
                         <div className="w-7 h-7 rounded-full bg-neon-purple border-2 border-card flex items-center justify-center text-[9px] font-black text-white shadow-sm">AD</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
