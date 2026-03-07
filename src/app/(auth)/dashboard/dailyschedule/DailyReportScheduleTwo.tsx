'use client';

import React from 'react';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  Check, 
  ShieldCheck,
  MoreHorizontal
} from 'lucide-react';

// --- 1. INTERFACE KHỚP CHÍNH XÁC VỚI SCHEMA SQL ---
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface DBTask {
  id: string;
  daily_report_id: string;
  title: string;
  contents: string | null;
  start_time: string; // ISO String: 2024-05-06T08:00:00Z
  end_time: string;   // ISO String: 2024-05-06T10:00:00Z
  duration_minutes: number;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number; // Đã thêm để khớp UI thanh phần trăm
}

export interface DBDailyReport {
  id: string;
  user_id: string;
  report_date: string;
  manager_comment: string | null;
  manager_reviewed: boolean;
  tasks: DBTask[];
}

// --- 2. MOCK DATA THEO CẤU TRÚC MỚI ---
const MOCK_DB_REPORT: DBDailyReport = {
  id: 'report-001',
  user_id: 'user-123',
  report_date: '2024-05-06',
  manager_reviewed: false,
  manager_comment: 'Cần đẩy nhanh Animation để kịp buổi Demo.',
  tasks: [
    {
      id: 'task-01',
      daily_report_id: 'report-001',
      title: 'Thiết kế Dashboard Task',
      contents: 'Hoàn thiện giao diện Schedule với hệ thống theme và nhịp thở.',
      start_time: '2024-05-06T10:30:00Z',
      end_time: '2024-05-06T12:30:00Z',
      duration_minutes: 120,
      status: 'in_progress',
      priority: 'urgent',
      progress: 65,
    },
    {
      id: 'task-02',
      daily_report_id: 'report-001',
      title: 'Nghiên cứu thị trường AI',
      contents: 'Phân tích đối thủ cạnh tranh mảng giáo dục kỹ năng sống.',
      start_time: '2024-05-06T08:00:00Z',
      end_time: '2024-05-06T10:00:00Z',
      duration_minutes: 120,
      status: 'done',
      priority: 'medium',
      progress: 100,
    }
  ]
};

export default function DailyReportSchedule({ selectedDate }: { selectedDate: Date }) {
  
  const getPriorityClasses = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20';
      default: return 'text-muted-foreground bg-foreground/5 border-border';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-card text-foreground rounded-[2.5rem] p-5 border border-border shadow-2xl transition-all duration-300">
      
      {/* HEADER */}
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
        <div className="absolute left-[2.95rem] top-0 bottom-0 w-[1px] bg-border" />

        <div className="space-y-10">
          {MOCK_DB_REPORT.tasks.map((task) => {
            const isDone = task.status === 'done';
            const isUrgent = task.priority === 'urgent' && !isDone;

            // Xử lý hiển thị thời gian từ ISO String
            const displayStart = task.start_time ? format(new Date(task.start_time), 'HH:mm') : '--:--';
            const displayEnd = task.end_time ? format(new Date(task.end_time), 'HH:mm') : '--:--';

            return (
              <div key={task.id} className="relative flex items-start gap-6 md:gap-10 group">
                
                {/* Cột thời gian */}
                <div className="w-10 pt-1 text-right">
                  <span className="text-[10px] font-bold text-muted-foreground/50 tabular-nums">
                    {displayStart}
                  </span>
                </div>

                {/* Nút thắt Timeline */}
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

                {/* Thẻ Card nội dung */}
                <div className={`flex-1 p-6 md:p-8 rounded-[2rem] transition-all duration-300 border relative
                  ${isDone 
                    ? 'bg-foreground/[0.02] border-transparent opacity-50 scale-[0.98]' 
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-xl shadow-sm'
                  }
                `}>
                  
                  {/* TAI THỎ CẢNH BÁO (NOTCH) */}
                  {isUrgent && (
                    <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
                      <div className="h-[6px] w-32 bg-red-500 rounded-b-2xl shadow-[0_2px_10px_rgba(239,68,68,0.4)] animate-breathe-danger" />
                    </div>
                  )}

                  {/* Header của Card */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-primary tracking-widest flex items-center gap-1">
                        <Clock size={12} /> {displayStart} — {displayEnd}
                      </span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${getPriorityClasses(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    {isDone && (
                      <div className="flex items-center gap-1 text-emerald-500 text-[9px] font-black bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">
                        <CheckCircle2 size={10} /> Done
                      </div>
                    )}
                  </div>

                  {/* Tiêu đề & Nội dung (contents thay cho description) */}
                  <h4 className={`text-lg font-bold tracking-tight mb-2 ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6 line-clamp-2">
                    {task.contents}
                  </p>

                  {/* Phản hồi Admin (manager_comment từ report cha) */}
                  {MOCK_DB_REPORT.manager_comment && !isDone && (
                    <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
                      <MessageSquare size={14} className="text-primary mt-1 shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-0.5">Admin Feedback</p>
                        <p className="text-[11px] italic opacity-80 leading-relaxed font-medium">
                          "{MOCK_DB_REPORT.manager_comment}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Footer: Tiến độ & Assignees */}
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
                    <div className="flex-1 max-w-[200px]">
                      <div className="flex justify-between items-center mb-2 px-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Tiến độ</span>
                        <span className="text-[10px] font-bold text-primary">{task.progress}%</span>
                      </div>
                      <div className="h-1 bg-foreground/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${isDone ? 'bg-emerald-500' : 'bg-primary'}`}
                          style={{ width: `${task.progress}%` }} 
                        />
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                       <div className="w-7 h-7 rounded-full bg-neon-cyan border-2 border-card flex items-center justify-center text-[8px] font-black text-white shadow-sm">TV</div>
                       <div className="w-7 h-7 rounded-full bg-neon-purple border-2 border-card flex items-center justify-center text-[8px] font-black text-white shadow-sm">AD</div>
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
        <button className="flex-1 py-4 rounded-2xl bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all">
          Gửi báo cáo mới
        </button>
        <button className="px-5 rounded-2xl border border-border bg-card hover:bg-foreground/5 transition-all active:scale-90">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}
