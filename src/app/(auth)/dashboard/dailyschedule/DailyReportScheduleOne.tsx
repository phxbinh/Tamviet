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
  User,
  ShieldCheck
} from 'lucide-react';

// --- 1. CHUẨN HOÁ INTERFACE (DATABASE SCHEMA) ---
export interface DailyReportItem {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  startTime: string; // Định dạng HH:mm
  endTime: string;   // Định dạng HH:mm
  status: 'pending' | 'in_progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;  // Giá trị từ 0 - 100
  adminComment?: string;
  isApproved: boolean;
  avatar?: string;
  tags?: string[];
}

// --- 2. MOCK DATA (DỮ LIỆU MẪU CHUẨN) ---
const MOCK_DAILY_REPORTS: DailyReportItem[] = [
  {
    id: 'rpt-001',
    userId: 'user-01',
    userName: 'Nguyễn Văn A',
    title: 'Nghiên cứu thị trường AI',
    description: 'Phân tích các đối thủ cạnh tranh trong mảng giáo dục kỹ năng sống và tâm lý học đường tại Việt Nam.',
    startTime: '08:00',
    endTime: '10:00',
    status: 'done',
    priority: 'medium',
    progress: 100,
    isApproved: true,
    adminComment: 'Dữ liệu rất chi tiết, cần bổ sung thêm phần dự báo tài chính cho quý tới.',
    avatar: 'https://i.pravatar.cc/150?u=1',
    tags: ['Nghiên cứu', 'AI']
  },
  {
    id: 'rpt-002',
    userId: 'user-01',
    userName: 'Nguyễn Văn A',
    title: 'Thiết kế Dashboard Tâm Việt',
    description: 'Hoàn thiện UI/UX cho tính năng Daily Report Schedule và tích hợp hệ thống cảnh báo nhịp thở.',
    startTime: '10:30',
    endTime: '12:30',
    status: 'in_progress',
    priority: 'urgent',
    progress: 65,
    isApproved: false,
    adminComment: 'Cần đẩy nhanh phần Animation để kịp buổi Demo chiều nay.',
    avatar: 'https://i.pravatar.cc/150?u=1',
    tags: ['Design', 'Tâm Việt']
  },
  {
    id: 'rpt-003',
    userId: 'user-01',
    userName: 'Nguyễn Văn A',
    title: 'Họp Team Kỹ thuật',
    description: 'Thống nhất cấu trúc Database và quy trình tự động hóa báo cáo định kỳ.',
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
  
  // Hàm xử lý style cho Priority Label
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 border-red-500/20 bg-red-500/10';
      case 'high': return 'text-orange-500 border-orange-500/20 bg-orange-500/10';
      case 'medium': return 'text-blue-500 border-blue-500/20 bg-blue-500/10';
      default: return 'text-slate-400 border-slate-500/20 bg-slate-500/10';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#080808]/80 backdrop-blur-3xl rounded-[3.5rem] p-10 border border-white/5 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)]">
      
      {/* HEADER: DATE & ADMIN MONITORING */}
      <div className="flex justify-between items-start mb-16 px-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-3 underline underline-offset-8">Report System</p>
          <h2 className="text-5xl font-bold tracking-tighter text-white">
            {format(selectedDate, 'dd')} <span className="text-white/20 font-thin italic">tháng</span> {format(selectedDate, 'MM')}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 border-4 border-[#121212] flex items-center justify-center shadow-2xl shadow-blue-500/20">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Identity Verified</span>
        </div>
      </div>

      {/* SCHEDULE TIMELINE LIST */}
      <div className="relative">
        {/* Đường kẻ dọc Timeline */}
        <div className="absolute left-[3.45rem] top-0 bottom-0 w-[1px] bg-linear-to-b from-transparent via-white/10 to-transparent" />

        <div className="space-y-12">
          {MOCK_DAILY_REPORTS.map((item) => {
            const isDone = item.status === 'done';
            const isUrgent = item.priority === 'urgent' && !isDone;

            return (
              <div key={item.id} className="relative flex items-start gap-10 group">
                
                {/* Thời gian bắt đầu (Bên trái) */}
                <div className="w-12 pt-1 text-right">
                  <span className="text-[11px] font-black text-white/30 tabular-nums tracking-tighter">
                    {item.startTime}
                  </span>
                </div>

                {/* Nút thắt Timeline (Trạng thái) */}
                <div className="relative z-10 pt-1">
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all group-hover:scale-110">
                      <Check size={12} className="text-black stroke-[4px]" />
                    </div>
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 bg-[#080808] transition-all duration-700 
                      ${isUrgent ? 'border-red-500 animate-breathe-danger shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-white/20 group-hover:border-blue-500'}`} 
                    />
                  )}
                </div>

                {/* Thẻ Nội dung Báo cáo (Task Card) */}
                <div className={`flex-1 p-8 rounded-[2.5rem] transition-all duration-500 border relative overflow-hidden
                  ${isDone 
                    ? 'bg-white/[0.02] border-transparent opacity-40 grayscale hover:grayscale-0 transition-all' 
                    : 'bg-white/[0.04] border-white/5 hover:bg-white/[0.08] hover:border-white/10 shadow-2xl'
                  }
                `}>
                  {/* Cảnh báo đỏ cho Task Khẩn cấp */}
                  {isUrgent && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-600 via-red-400 to-transparent" />
                  )}

                  {/* Header của Card */}
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase flex items-center gap-1.5">
                        <Clock size={10} /> {item.startTime} — {item.endTime}
                      </span>
                      <span className={`text-[8px] font-black px-2.5 py-1 rounded-md border ${getPriorityStyle(item.priority)} uppercase tracking-tighter`}>
                        {item.priority}
                      </span>
                    </div>
                    {item.isApproved && (
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[9px] font-black bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                        <CheckCircle2 size={10} /> APPROVED
                      </div>
                    )}
                  </div>

                  {/* Tiêu đề & Mô tả */}
                  <h4 className={`text-xl font-bold tracking-tight mb-2 ${isDone ? 'line-through text-white/40' : 'text-white'}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/50 leading-relaxed mb-6 font-medium">
                    {item.description}
                  </p>

                  {/* Phần Admin Comment (Dành cho quản lý phê duyệt) */}
                  {item.adminComment && (
                    <div className="mb-6 p-5 rounded-3xl bg-blue-600/5 border border-blue-600/10 flex gap-4 items-start group/comment">
                      <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-500 group-hover/comment:scale-110 transition-transform">
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2">
                           Feedback <span className="w-1 h-1 rounded-full bg-blue-500/40" /> Manager
                        </p>
                        <p className="text-[12px] italic text-blue-100/60 leading-relaxed font-medium">"{item.adminComment}"</p>
                      </div>
                    </div>
                  )}

                  {/* Footer Card: Tiến độ & Tags */}
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <div className="flex-1 max-w-[220px]">
                      <div className="flex justify-between items-center mb-2.5 px-1">
                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Progress</span>
                        <span className="text-[10px] font-black text-white italic">{item.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${isDone ? 'bg-emerald-500' : 'bg-linear-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(37,99,235,0.5)]'}`}
                          style={{ width: `${item.progress}%` }} 
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {item.tags?.map(tag => (
                        <span key={tag} className="text-[8px] font-black text-white/20 border border-white/5 px-3 py-1.5 rounded-xl uppercase tracking-tighter hover:text-white transition-colors cursor-default">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER ACTION BUTTONS */}
      <div className="mt-20 flex gap-5">
        <button className="flex-[3] py-6 rounded-3xl bg-white text-black font-black text-[11px] uppercase tracking-[0.25em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl hover:-translate-y-1 active:scale-95">
          Gửi báo cáo hôm nay
        </button>
        <button className="flex-1 rounded-3xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all hover:rotate-12 active:scale-90 shadow-xl">
          <Clock size={20} />
        </button>
      </div>
    </div>
  );
}
