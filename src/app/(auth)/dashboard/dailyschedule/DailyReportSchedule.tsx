'use client';

import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle2, Circle, Flag, MessageSquare, MoreHorizontal } from 'lucide-react';

interface ScheduleItem {
  id: string;
  time: string;
  endTime: string;
  title: string;
  description?: string;
  status: 'done' | 'pending' | 'urgent';
  priority: 'high' | 'medium' | 'low';
  progress: number;
  
}

const DAILY_DATA: ScheduleItem[] = [
  { id: '1', time: '07:00', endTime: '08:00', title: 'Jogging', status: 'done', priority: 'low', progress: 100 },
  { id: '2', time: '08:00', endTime: '10:45', title: 'Read medical health information', description: 'Nghiên cứu tài liệu chuyên ngành Tâm Việt', status: 'done', priority: 'medium', progress: 100 },
  { id: '3', time: '10:45', endTime: '13:00', title: 'Interview UI/UX Designer', description: 'Phỏng vấn ứng viên vòng 2 cho dự án Dashboard', status: 'urgent', priority: 'high', progress: 45 },
  { id: '4', time: '13:00', endTime: '14:00', title: 'Replying to emails', status: 'pending', priority: 'low', progress: 0 },
  { id: '5', time: '14:00', endTime: '18:00', title: 'Discussing the plan', description: 'Họp ban lãnh đạo về KPI quý mới', status: 'pending', priority: 'high', progress: 10 },
];

export default function DailyReportSchedule({ selectedDate }: { selectedDate: Date }) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-3xl rounded-[3rem] p-4 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]">
      
      {/* Header Profile/Date */}
      <div className="flex justify-between items-end mb-12 px-2">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">September</p>
          <h2 className="text-4xl font-bold tracking-tighter">Today</h2>
        </div>
        <div className="flex gap-2">
           {[4, 5, 6, 7, 8].map((d) => (
             <div key={d} className={`w-10 h-16 rounded-full flex flex-col items-center justify-center gap-2 transition-all ${d === 6 ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'hover:bg-white/5'}`}>
                <span className="text-[10px] font-bold opacity-60 uppercase">{d === 6 ? 'W' : 'T'}</span>
                <span className="text-sm font-black">{d}</span>
                {d === 7 && <div className="w-1 h-1 rounded-full bg-blue-500" />}
             </div>
           ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative">
        {/* Vertical Line Line */}
        <div className="absolute left-[3.25rem] top-0 bottom-0 w-[1.5px] bg-linear-to-b from-transparent via-border/50 to-transparent" />

        <div className="space-y-10">
          {DAILY_DATA.map((item) => (
            <div key={item.id} className="relative flex items-start gap-8 group">
              
              {/* Time Column */}
              <div className="w-10 pt-1 text-[11px] font-bold text-muted-foreground/50 tabular-nums">
                {item.time}
              </div>

              {/* Status Circle */}
              <div className="relative z-10 pt-1">
                {item.status === 'done' ? (
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-white shadow-[0_0_12px_rgba(255,255,255,0.4)] flex items-center justify-center">
                     <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                ) : (
                  <div className={`w-4 h-4 rounded-full border-2 bg-background transition-all duration-500 ${item.status === 'urgent' ? 'border-red-500 animate-breathe-danger' : 'border-border group-hover:border-blue-500'}`} />
                )}
              </div>

              {/* Task Content Card */}
              <div className={`flex-1 p-6 rounded-[2rem] transition-all duration-500 border ${
                item.status === 'done' 
                ? 'bg-white/5 border-transparent opacity-40 scale-[0.98]' 
                : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10 hover:shadow-2xl'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${item.status === 'urgent' ? 'text-red-500' : 'text-blue-500'}`}>
                    {item.time} — {item.endTime}
                  </span>
                  {item.priority === 'high' && <Flag size={12} className="text-red-500 fill-red-500" />}
                </div>

                <h4 className={`text-base font-bold tracking-tight mb-2 ${item.status === 'done' ? 'line-through' : 'text-white'}`}>
                  {item.title}
                </h4>
                
                {/* Sửa isCompleted thành status !== 'done' */}
                {item.description && item.status !== 'done' && (
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Progress Bar & Footer - Sửa isCompleted thành status !== 'done' */}
                {item.status !== 'done' && item.progress > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4">
                    <div className="flex-1 h-[3px] bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-1000" 
                        style={{ width: `${item.progress}%` }} 
                      />
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground">{item.progress}%</span>
                    <div className="flex -space-x-2">
                       <div className="w-5 h-5 rounded-full bg-purple-500 border border-background flex items-center justify-center text-[8px] font-bold">A</div>
                       <div className="w-5 h-5 rounded-full bg-blue-500 border border-background flex items-center justify-center text-[8px] font-bold">M</div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <button className="w-full mt-12 py-4 rounded-3xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:scale-[0.98] active:scale-95 transition-all shadow-xl shadow-white/10">
        Add New Task
      </button>
    </div>
  );
}
