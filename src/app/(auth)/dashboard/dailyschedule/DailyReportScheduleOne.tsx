'use client';

import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  Check, 
  User,
  ShieldCheck,
  MoreHorizontal
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
      case 'medium': return 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20';
      default: return 'text-muted-foreground bg-foreground/5 border-border';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-card text-foreground rounded-[2.5rem] p-6 md:p-10 border border-border shadow-2xl transition-all duration-300">
      
      {/* HEADER: Adaptable to Theme */}
      <div className="flex justify-between items-start mb-12 px-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Tâm Việt Schedule</p>
          <h2 className="text-4xl font-bold tracking-tighter">
            {format(selectedDate, 'dd')} <span className="text-muted-foreground/40 font-light">tháng</span> {format(selectedDate, 'MM')}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Verified Report</span>
        </div>
      </div>

      {/* TIMELINE BODY */}
      <div className="relative">
        {/* Line mờ dựa trên biến --border */}
        <div className="absolute left-[2.95rem] top-0 bottom-0 w-[1px] bg-border" />

        <div className="space-y-10">
          {MOCK_DAILY_REPORTS.map((item) => {
            const isDone = item.status === 'done';
            const isUrgent = item.priority === 'urgent' && !isDone;

            return (
              <div key={item.id} className="relative flex items-start gap-6 md:gap-10 group">
                
                {/* Thời gian */}
                <div className="w-10 pt-1 text-right">
                  <span className="text-[10px] font-bold text-muted-foreground/50 tabular-nums">
                    {item.startTime}
                  </span>
                </div>

                {/* Nút thắt Timeline (Sử dụng Animation Nhịp Thở từ globals.css) */}
                <div className="relative z-10 pt-1">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Check size={12} className="text-white stroke-[4px]" />
                    </div>
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 bg-card transition-all duration-500 
                      ${isUrgent ? 'border-red-500 animate-breathe-danger' : 'border-border group-hover:border-primary'}`} 
                    />
                  )}
                </div>

                {/* Thẻ Card nội dung (Sử dụng biến --card và --border) */}
                <div className={`flex-1 p-6 md:p-8 rounded-[2rem] transition-all duration-300 border relative
                  ${isDone 
                    ? 'bg-foreground/[0.02] border-transparent opacity-50 scale-[0.98]' 
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-xl'
                  }
                `}>
                  {/* Cảnh báo đỏ cho Urgent */}
                  {isUrgent && (
                    <div className="absolute top-6 md:top-8 left-0 w-full h-1 bg-red-500 rounded-t-full" />
                  )}

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-primary tracking-widest flex items-center gap-1">
                        <Clock size={12} /> {item.startTime} — {item.endTime}
                      </span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${getPriorityClasses(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    {item.isApproved && (
                      <div className="flex items-center gap-1 text-emerald-500 text-[9px] font-black bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">
                        <CheckCircle2 size={10} /> Approved
                      </div>
                    )}
                  </div>

                  <h4 className={`text-lg font-bold tracking-tight mb-2 ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Phản hồi Admin */}
                  {item.adminComment && (
                    <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3 items-start">
                      <MessageSquare size={14} className="text-primary mt-1" />
                      <div>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-0.5">Admin Feedback</p>
                        <p className="text-[11px] italic opacity-80 leading-relaxed">"{item.adminComment}"</p>
                      </div>
                    </div>
                  )}

                  {/* Thanh Progress đồng bộ màu Theme */}
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
                    <div className="flex-1 max-w-[200px]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Tiến độ</span>
                        <span className="text-[10px] font-bold text-primary">{item.progress}%</span>
                      </div>
                      <div className="h-1 bg-foreground/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${isDone ? 'bg-emerald-500' : 'bg-primary'}`}
                          style={{ width: `${item.progress}%` }} 
                        />
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                       <div className="w-6 h-6 rounded-full bg-neon-cyan border-2 border-card flex items-center justify-center text-[8px] font-black text-white">TV</div>
                       <div className="w-6 h-6 rounded-full bg-neon-purple border-2 border-card flex items-center justify-center text-[8px] font-black text-white">AD</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-12 flex gap-4">
        <button className="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
          Gửi báo cáo mới
        </button>
        <button className="px-5 rounded-2xl border border-border bg-card hover:bg-foreground/5 transition-all">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}
