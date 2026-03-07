'use client';

import React from 'react';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU KHỚP SQL ---
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface DBTask {
  id: string;
  title: string;
  contents: string | null;
  start_time: string; // ISO string từ DB
  end_time: string;   // ISO string từ DB
  status: TaskStatus;
  priority: TaskPriority;
  progress: number; 
}

export interface DBDailyReport {
  id: string;
  report_date: string;
  manager_comment: string | null;
  tasks: DBTask[];
}

// Giả lập dữ liệu fetch từ DB (đã qua join bảng)
const MOCK_DB_DATA: DBDailyReport = {
  id: 'report-123',
  report_date: '2024-05-06',
  manager_comment: "Cần đẩy nhanh Animation để kịp buổi Demo chiều nay.",
  tasks: [
    {
      id: 'task-1',
      title: 'Thiết kế Dashboard Task',
      contents: 'Hoàn thiện giao diện Schedule với hệ thống theme và nhịp thở.',
      start_time: '2024-05-06T10:30:00Z',
      end_time: '2024-05-06T12:30:00Z',
      status: 'in_progress',
      priority: 'urgent',
      progress: 65
    },
    {
      id: 'task-2',
      title: 'Nghiên cứu thị trường AI',
      contents: 'Phân tích đối thủ cạnh tranh mảng giáo dục.',
      start_time: '2024-05-06T08:00:00Z',
      end_time: '2024-05-06T10:00:00Z',
      status: 'done',
      priority: 'medium',
      progress: 100
    }
  ]
};

export default function DailyReportSchedule({ selectedDate }: { selectedDate: Date }) {
  
  const getPriorityClasses = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-muted-foreground bg-foreground/5 border-border';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card text-foreground rounded-[3rem] p-6 border border-border shadow-2xl flex flex-col h-full max-h-[95vh]">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 shrink-0">
        <button className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center border border-border hover:bg-foreground/10 transition-all">
          <LayoutGrid size={20} />
        </button>
        <div className="text-center">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            {format(selectedDate, 'MMMM')}
          </p>
          <h2 className="text-2xl font-black tracking-tight italic">Today</h2>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
          <ShieldCheck size={20} className="text-primary" />
        </div>
      </div>

      {/* TIMELINE CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 relative">
        <div className="absolute left-[3.45rem] top-0 bottom-0 w-[1px] bg-border/60" />

        <div className="space-y-8 pb-10">
          {MOCK_DB_DATA.tasks.map((task) => {
            const isDone = task.status === 'done';
            const isUrgent = task.priority === 'urgent' && !isDone;
            
            // Format lại giờ từ ISO String của DB
            const sTime = format(new Date(task.start_time), 'HH:mm');
            const eTime = format(new Date(task.end_time), 'HH:mm');

            return (
              <div key={task.id} className="relative flex items-start gap-8 group animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* 1. Time Label */}
                <div className="w-10 pt-6 text-right shrink-0">
                  <span className="text-[11px] font-bold text-muted-foreground/40 tabular-nums uppercase">
                    {sTime}
                  </span>
                </div>

                {/* 2. Status Dot */}
                <div className="relative z-10 pt-[1.55rem] shrink-0">
                   <div className={`w-4 h-4 rounded-full border-2 bg-card transition-all duration-700 
                      ${isDone ? 'bg-primary border-primary' : isUrgent ? 'border-red-500 animate-breathe-danger shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'border-border'}`} 
                    />
                </div>

                {/* 3. Task Card */}
                <div className={`flex-1 rounded-[2.2rem] border relative overflow-hidden transition-all duration-300
                  ${isDone ? 'bg-foreground/[0.02] border-transparent opacity-50' : 'bg-[#0f172a] border-white/5 shadow-2xl'}
                `}>
                  
                  {/* TAI THỎ URGENT (Notch) */}
                  {isUrgent && (
                    <div className="absolute top-0 left-0 right-0 flex justify-center">
                      <div className="h-[6px] w-32 bg-red-600 rounded-b-2xl shadow-[0_2px_12px_rgba(220,38,38,0.6)] animate-breathe-danger" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4 pt-2">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-blue-400" />
                        <span className="text-[11px] font-bold text-blue-400 tracking-tight">
                          {sTime} — {eTime}
                        </span>
                        {isUrgent && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/30 uppercase tracking-tighter">
                            URGENT
                          </span>
                        )}
                      </div>
                      {isDone && <CheckCircle2 size={16} className="text-emerald-500" />}
                    </div>

                    <h4 className={`text-xl font-bold tracking-tight mb-2 text-white ${isDone ? 'line-through opacity-40' : ''}`}>
                      {task.title}
                    </h4>
                    <p className="text-[13px] text-white/50 mb-6 leading-relaxed line-clamp-2 italic">
                      {task.contents}
                    </p>

                    {/* Manager Feedback lấy từ bảng daily_reports */}
                    {MOCK_DB_DATA.manager_comment && !isDone && (
                      <div className="mb-6 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                        <MessageSquare size={14} className="text-blue-500 mt-1 shrink-0" />
                        <div>
                          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Admin Feedback</p>
                          <p className="text-[12px] italic text-white/70">"{MOCK_DB_DATA.manager_comment}"</p>
                        </div>
                      </div>
                    )}

                    {/* Progress Bar & Avatars */}
                    <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                       <div className="flex-1 max-w-[160px]">
                          <div className="flex justify-between mb-1.5 px-0.5 text-[9px] font-bold uppercase tracking-widest">
                             <span className="text-white/20">Tiến độ</span>
                             <span className="text-blue-400 font-black">{task.progress}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden p-[0.5px]">
                             <div 
                                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-all duration-1000" 
                                style={{ width: `${task.progress}%` }} 
                             />
                          </div>
                       </div>
                       
                       <div className="flex -space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-[#0f172a] flex items-center justify-center text-[9px] font-black text-white hover:-translate-y-1 transition-transform">TV</div>
                          <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#0f172a] flex items-center justify-center text-[9px] font-black text-white hover:-translate-y-1 transition-transform shadow-lg">AD</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FIXED FOOTER BUTTON */}
      <div className="pt-6 shrink-0">
         <button className="w-full py-4 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:brightness-110 active:scale-[0.97] transition-all">
            Gửi báo cáo mới
         </button>
      </div>
    </div>
  );
}
