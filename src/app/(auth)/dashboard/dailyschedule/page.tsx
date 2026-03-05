'use client';

import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle2, Circle, MoreVertical, Paperclip } from 'lucide-react';

// Giả sử đây là dữ liệu báo cáo từ database
const DAILY_SCHEDULE = [
  { id: 't1', time: '07:00', endTime: '08:00', title: 'Chạy bộ buổi sáng', status: 'done', color: 'blue' },
  { id: 't2', time: '08:00', endTime: '10:45', title: 'Đọc thông tin y tế & sức khỏe', status: 'done', color: 'blue' },
  { id: 't3', time: '10:45', endTime: '13:00', title: 'Phỏng vấn ứng viên UI/UX', status: 'pending', color: 'blue' },
  { id: 't4', time: '13:00', endTime: '14:00', title: 'Trả lời Email khách hàng', status: 'pending', color: 'blue' },
  { id: 't5', time: '14:00', endTime: '18:00', title: 'Thảo luận kế hoạch Quý 2', status: 'pending', color: 'blue' },
  { id: 't6', time: '19:00', endTime: '20:00', title: 'Học làm bánh tráng miệng', status: 'pending', color: 'blue' },
  { id: 't7', time: '22:00', endTime: '', title: 'Đọc sách ban đêm', status: 'pending', color: 'blue' },
];

export default function DailyReportSchedule({ selectedDate }: { selectedDate: Date }) {
  return (
    <div className="bg-card/30 backdrop-blur-xl rounded-[2.5rem] p-6 border border-border/50 shadow-2xl">
      {/* Header của Schedule */}
      <div className="flex justify-between items-center mb-8 px-2">
        <div>
          <h3 className="text-xl font-black tracking-tight">Lịch trình chi tiết</h3>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
            {format(selectedDate, 'eeee, dd MMMM', { locale: vi })}
          </p>
        </div>
        <button className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Timeline Container */}
      <div className="relative space-y-0 pl-4">
        {/* Đường kẻ dọc mờ chạy xuyên suốt */}
        <div className="absolute left-[2.1rem] top-2 bottom-2 w-[1px] bg-border/40 z-0" />

        {DAILY_SCHEDULE.map((item, index) => (
          <div key={item.id} className="relative flex gap-8 mb-6 group">
            
            {/* Cột thời gian bên trái */}
            <div className="w-12 pt-1 text-right text-[11px] font-bold text-muted-foreground/60 whitespace-nowrap">
              {item.time}
            </div>

            {/* Điểm mốc (Circle Indicator) */}
            <div className="relative z-10 pt-1.5">
              {item.status === 'done' ? (
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center border-4 border-background shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  <CheckCircle2 size={10} className="text-white" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-background border-2 border-border group-hover:border-blue-400 transition-colors" />
              )}
            </div>

            {/* Thẻ nội dung (Task Card) */}
            <div className={`flex-1 p-4 rounded-[1.5rem] transition-all duration-300 border
              ${item.status === 'done' 
                ? 'bg-blue-500/5 border-blue-500/10 opacity-70' 
                : 'bg-foreground/[0.03] border-transparent hover:border-border hover:shadow-lg hover:-translate-y-0.5'}
            `}>
              <div className="flex justify-between items-start">
                <div>
                  {item.endTime && (
                    <span className="text-[10px] font-bold text-blue-500/80 tracking-tighter block mb-1">
                      {item.time} - {item.endTime}
                    </span>
                  )}
                  <h4 className={`text-sm font-bold ${item.status === 'done' ? 'line-through' : ''}`}>
                    {item.title}
                  </h4>
                </div>
                {item.status === 'pending' && (
                   <button className="text-muted-foreground/30 hover:text-blue-500 transition-colors">
                      <Paperclip size={14} />
                   </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
