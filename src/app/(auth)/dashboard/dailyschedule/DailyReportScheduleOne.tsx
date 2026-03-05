'use client';

import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  CheckCircle2, 
  Circle, 
  MessageSquare, 
  Flag, 
  Clock, 
  Check, 
  MoreHorizontal,
  User
} from 'lucide-react';

// --- CHUẨN HOÁ INTERFACE THEO DATABASE SCHEMA ---
export interface DailyReportItem {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  status: 'pending' | 'in_progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;  // 0-100
  adminComment?: string;
  isApproved: boolean;
  avatar?: string;
  tags?: string[];
}

// --- MOCK DATA CHUẨN HOÁ ---
const MOCK_DAILY_REPORTS: DailyReportItem[] = [
  {
    id: 'rpt-001',
    userId: 'user-01',
    userName: 'Nguyễn Văn A',
    title: 'Nghiên cứu thị trường AI',
    description: 'Phân tích các đối thủ cạnh tranh trong mảng giáo dục kỹ năng sống và tâm lý học đường.',
    startTime: '08:00',
    endTime: '10:00',
    status: 'done',
    priority: 'medium',
    progress: 100,
    isApproved: true,
    adminComment: 'Dữ liệu rất chi tiết, cần phát huy trong các báo cáo sau.',
    avatar: 'https://i.pravatar.cc/150?u=1',
    tags: ['Nghiên cứu', 'AI']
  },
  {
    id: 'rpt-002',
    userId: 'user-01',
    userName: 'Nguyễn Văn A',
    title: 'Thiết kế Dashboard Tâm Việt',
    description: 'Hoàn thiện UI/UX cho tính năng Daily Report Schedule và hệ thống cảnh báo nhịp thở.',
    startTime: '10:30',
    endTime: '12:30',
    status: 'in_progress',
    priority: 'urgent',
    progress: 65,
    isApproved: false,
    adminComment: 'Cần đẩy nhanh phần Animation để kịp buổi Demo chiều nay với Ban lãnh đạo.',
    avatar: 'https://i.pravatar.cc/150?u=1',
    tags: ['Design', 'Tâm Việt']
  },
  {
    id: 'rpt-003',
    userId: 'user-01',
    userName: 'Nguyễn Văn A',
    title: 'Họp Team Kỹ thuật',
    description: 'Thống nhất cấu trúc Database và quy trình Deploy lên Vercel.',
    startTime: '14:00',
    endTime: '15:30',
    status: 'pending',
    priority: 'high',
    progress: 0,
    isApproved: false,
    tags: ['Meeting']
  }
];

export default function DailyReportSchedule({ selectedDate }: { selectedDate: Date }) {
  
  // Hàm bổ trợ render màu sắc theo Priority
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 border-red-500/20 bg-red-500/10';
      case 'high': return 'text-orange-500 border-orange-500/20 bg-orange-500/10';
      case 'medium': return 'text-blue-500 border-blue-500/20 bg-blue-500/10';
      default: return 'text-slate-400 border-slate-500/20 bg-slate-500/10';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#0a0a0a]/60 backdrop-blur-3xl rounded-[3.5rem] p-10 border border-white/5 shadow-2xl">
      
      {/* HEADER: DATE & USER INFO */}
      <div className="flex justify-between items-start mb-16 px-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-3">Hệ thống báo cáo</p>
          <h2 className="text-5xl font-bold tracking-tighter text-white">
            {format(selectedDate, 'dd')} <span className="text-muted-foreground/40 font-light">tháng</span> {format(selectedDate, 'MM')}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex -space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 border-4 border-[#121212] flex items-center justify-center shadow-xl">
              <User size={20} className="text-white" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Admin Monitoring</span>
        </div>
      </div>

      {/* SCHEDULE TIMELINE */}
      <div className="relative">
        {/* Central Vertical Line */}
        <div className="absolute left-[3.45rem] top-0 bottom-0 w-[1px] bg-linear-to-b from-transparent via-white/10 to-transparent" />

        <div className="space-y-12">
          {MOCK_DAILY_REPORTS.map((item) => (
            <div key={item.id} className="relative flex items-start gap-10 group">
              
              {/* Left Side: Start Time */}
              <div className="w-12 pt-1 text-right">
                <span className="text-[11px] font-black text-muted-foreground/40 tabular-nums">
                  {item.startTime}
                </span>
              </div>

              {/* Center: Status Indicator */}
              <div className="relative z-10 pt-1">
                {item.status === 'done' ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform group-hover:scale-125">
                    <Check size={12} className="text-black stroke-[4px]" />
                  </div>
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 bg-[#0a0a0a] transition-all duration-500 
                    ${item.status === 'urgent' ? 'border-red-500 animate-breathe-danger' : 'border-white/20 group-hover:border-blue-500'}`} 
                  />
                )}
              </div>

              {/* Right Side: Content Card */}
              <div className={`flex-1 p-8 rounded-[2.5rem] transition-all duration-500 border relative overflow-hidden
                ${item.status === 'done' 
                  ? 'bg-white/[0.02] border-transparent opacity-40 scale-[0.97]' 
                  : 'bg-white/[0.04] border-white/5 hover:bg-white/[0.07] hover:border-white/10 shadow-2xl hover:-translate-y-1'
                }
              `}>
                {/* Status Bar for High Priority */}
                {item.priority === 'urgent' && item.status !== 'done' && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-600 to-transparent" />
                )}

                {/* Top Row: Meta Info */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase">
                      {item.startTime} — {item.endTime}
                    </span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-md border ${getPriorityStyle(item.priority)} uppercase`}>
                      {item.priority}
                    </span>
                  </div>
                  {item.isApproved && (
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[9px] font-black bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                      <CheckCircle2 size={10} /> APPROVED
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <h4 className={`text-lg font-bold tracking-tight mb-2 ${item.status === 'done' ? 'line-through text-muted-foreground' : 'text-white'}`}>
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground/80 leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Admin Feedback Section (Mục tiêu quan trọng cho Quản lý) */}
                {item.adminComment && (
                  <div className="mb-6 p-4 rounded-2xl bg-blue-600/5 border border-blue-600/10 flex gap-4 items-start">
                    <div className="p-2 rounded-lg bg-blue-600/10 text-blue-500">
                      <MessageSquare size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Phản hồi từ Admin</p>
                      <p className="text-[11px] italic text-blue-100/70 leading-snug">"{item.adminComment}"</p>
                    </div>
                  </div>
                )}

                {/* Bottom Row: Progress & Assignee */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                  <div className="flex-1 max-w-[200px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-black text-muted-foreground uppercase">Progress</span>
                      <span className="text-[9px] font-black text-white">{item.progress}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${item.status === 'done' ? 'bg-emerald-500' : 'bg-blue-600'}`}
                        style={{ width: `${item.progress}%` }} 
                      />
                    </div>
                  </div>
                  
                  {/* Tag Display */}
                  <div className="flex gap-2">
                    {item.tags?.map(tag => (
                      <span key={tag} className="text-[8px] font-bold text-muted-foreground/40 border border-white/5 px-2 py-1 rounded-lg italic">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="mt-16 flex gap-4">
        <button className="flex-1 py-5 rounded-[1.5rem] bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95">
          Tạo báo cáo mới
        </button>
        <button className="px-6 rounded-[1.5rem] bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all">
          <Clock size={18} />
        </button>
      </div>
    </div>
  );
}
