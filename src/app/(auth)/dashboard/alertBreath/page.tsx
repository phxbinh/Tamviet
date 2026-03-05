'use client';

import React, { useState, useMemo } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval,
  isWithinInterval, startOfDay, endOfDay, differenceInHours
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, Plus, AlertCircle, CheckCircle2, Circle
} from 'lucide-react';


// 1. Interface đầy đủ
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: string;
  color: string;
  time?: string;
  isCompleted: boolean; // Trạng thái hoàn thành
}

// 2. MockData mẫu (thêm trạng thái)
const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Họp chiến lược Tâm Việt',
    start: new Date(2026, 2, 5, 10, 0), 
    end: new Date(2026, 2, 5, 11, 30),
    time: '10:00 - 11:30',
    type: 'meeting',
    color: 'neon-purple',
    isCompleted: false
  },
  {
    id: 'multi-1',
    title: '🚀 Sprint: Hoàn thiện Dashboard',
    start: new Date(2026, 2, 1),  
    end: new Date(2026, 2, 6), // Gần deadline
    type: 'project',
    color: 'neon-cyan',
    isCompleted: false
  }
];


export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);

  // --- LOGIC XỬ LÝ TRẠNG THÁI & DEADLINE ---
  
  const toggleComplete = (id: string) => {
    setEvents(prev => prev.map(ev => 
      ev.id === id ? { ...ev, isCompleted: !ev.isCompleted } : ev
    ));
  };

  const getUrgency = (event: CalendarEvent) => {
    if (event.isCompleted) return 'none';
    const now = new Date();
    const hoursToDeadline = differenceInHours(event.end, now);

    if (hoursToDeadline < 0) return 'overdue';    // Quá hạn
    if (hoursToDeadline <= 12) return 'danger';   // Nguy hiểm (dưới 12h)
    if (hoursToDeadline <= 48) return 'warning';  // Gấp gáp (dưới 48h)
    return 'normal';                              // Bình tĩnh
  };

  const getUrgencyClass = (urgency: string) => {
    switch (urgency) {
      case 'danger': return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-breathe-danger';
      case 'warning': return 'bg-orange-500 animate-breathe-fast';
      case 'normal': return 'bg-neon-cyan animate-breathe-slow';
      case 'overdue': return 'bg-gray-700 grayscale';
      default: return 'bg-slate-400';
    }
  };

  // --- RENDER LOGIC ---
  const selectedDayEvents = useMemo(() => {
    return events.filter(event => 
      isWithinInterval(startOfDay(selectedDate), {
        start: startOfDay(event.start),
        end: endOfDay(event.end || event.start)
      })
    );
  }, [events, selectedDate]);

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 animate-in fade-in duration-700">
      
      {/* HEADER TƯƠNG TỰ BẢN TRƯỚC */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center text-neon-cyan border border-neon-cyan/30">
                <CalendarIcon size={28} />
            </div>
            <div>
                <h1 className="text-3xl font-black capitalize tracking-tight mb-1">
                {format(currentMonth, 'MMMM yyyy', { locale: vi })}
                </h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Hệ thống giám sát Deadline</p>
            </div>
        </div>
        {/* Nút điều hướng tháng giữ nguyên... */}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LỊCH GRID TRÁI (Tương tự bản trước nhưng thêm gạch ngang nếu hoàn thành) */}
        <div className="xl:col-span-8">
           {/* ... Grid Render logic ... */}
           {/* Lưu ý: Trong phần map sự kiện trên ô lịch, thêm: 
               className={event.isCompleted ? 'opacity-50 line-through' : ''} 
           */}
        </div>

        {/* CHI TIẾT BÊN PHẢI - NƠI HIỂN THỊ TRẠNG THÁI MẠNH MẼ */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-card/40 backdrop-blur-3xl border border-border/60 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
             <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-muted-foreground flex justify-between">
                <span>Chi tiết ngày {format(selectedDate, 'dd/MM')}</span>
                <Tag size={16} />
             </h2>

             <div className="space-y-4">
                {selectedDayEvents.map(event => {
                  const urgency = getUrgency(event);
                  const urgencyClass = getUrgencyClass(urgency);

                  return (
                    <div key={event.id} 
                      className={`group relative p-5 rounded-3xl border transition-all duration-500
                        ${event.isCompleted ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-foreground/[0.03] border-border/50'}
                      `}
                    >
                       {/* Chỉ báo trạng thái Nhịp Thở */}
                       {!event.isCompleted && (
                         <div className={`absolute -right-1 -top-1 w-4 h-4 rounded-full border-2 border-background z-20 ${urgencyClass}`} />
                       )}

                       <div className="flex items-start gap-4">
                          <button 
                            onClick={() => toggleComplete(event.id)}
                            className={`mt-1 transition-transform active:scale-75 ${event.isCompleted ? 'text-emerald-500' : 'text-muted-foreground/40 hover:text-neon-cyan'}`}
                          >
                            {event.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                          </button>

                          <div className="flex-1">
                             <div className="flex justify-between items-start mb-1">
                                <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border 
                                  ${event.isCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-foreground/10 border-border text-muted-foreground'}
                                `}>
                                   {event.isCompleted ? 'Hoàn thành' : urgency === 'danger' ? 'KHẨN CẤP' : urgency === 'warning' ? 'SẮP HẾT HẠN' : 'Đang làm'}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-bold">{event.time}</span>
                             </div>

                             <h4 className={`text-sm font-bold transition-all ${event.isCompleted ? 'text-muted-foreground/50 line-through' : 'text-foreground'}`}>
                               {event.title}
                             </h4>
                          </div>
                       </div>

                       {/* Cảnh báo mạnh nếu gần Deadline */}
                       {!event.isCompleted && urgency === 'danger' && (
                         <div className="mt-4 flex items-center gap-2 text-red-500 bg-red-500/10 p-2 rounded-xl animate-pulse">
                            <AlertCircle size={14} />
                            <span className="text-[9px] font-black uppercase">Thời gian đang cạn dần! Hoàn thành ngay.</span>
                         </div>
                       )}
                    </div>
                  )
                })}
             </div>

             <button className="w-full mt-8 py-5 bg-foreground text-background rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-xl transition-all">
                <Plus size={18} /> THÊM NHIỆM VỤ MỚI
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
