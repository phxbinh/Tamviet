'use client';

import React, { useState, useMemo } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval,
  isWithinInterval, startOfDay, endOfDay
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, Plus, Tag, AlertCircle, CheckCircle2 
} from 'lucide-react';

// --- CHUẨN HÓA MOCK DATA (Multi-day support) ---
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Họp chiến lược Tâm Việt',
    start: new Date(2026, 2, 5, 10, 0), 
    end: new Date(2026, 2, 5, 11, 30),
    type: 'meeting',
    color: 'neon-purple'
  },
  {
    id: 'multi-1',
    title: '🚀 Sprint: Hoàn thiện Dashboard',
    start: new Date(2026, 2, 9),  
    end: new Date(2026, 2, 13),    
    type: 'project',
    color: 'neon-cyan'
  },
  {
    id: 'multi-2',
    title: '🏝️ Nghỉ phép năm',
    start: new Date(2026, 2, 14), 
    end: new Date(2026, 2, 16),   
    type: 'vacation',
    color: 'red-500'
  }
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events] = useState(MOCK_EVENTS);

  // Logic lọc sự kiện cho cột chi tiết bên phải
  const selectedDayEvents = useMemo(() => {
    return events.filter(event => 
      isWithinInterval(startOfDay(selectedDate), {
        start: startOfDay(event.start),
        end: endOfDay(event.end || event.start)
      })
    );
  }, [events, selectedDate]);

  // Logic lấy sự kiện cho từng ô ngày trên lưới
  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isWithinInterval(startOfDay(day), {
        start: startOfDay(event.start),
        end: endOfDay(event.end || event.start)
      })
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center text-neon-cyan border border-neon-cyan/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <CalendarIcon size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black capitalize tracking-tight mb-1">
              {format(currentMonth, 'MMMM yyyy', { locale: vi })}
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold italic">Hệ thống đồng bộ thời gian thực</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-card/30 backdrop-blur-2xl border border-border/50 p-2 rounded-2xl shadow-2xl">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2.5 hover:bg-foreground/10 rounded-xl transition-all active:scale-90"><ChevronLeft size={22} /></button>
          <button onClick={() => setCurrentMonth(new Date())} className="px-6 py-2 text-xs font-black hover:bg-foreground/10 rounded-xl transition-all uppercase tracking-widest border border-transparent hover:border-border">Hôm nay</button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2.5 hover:bg-foreground/10 rounded-xl transition-all active:scale-90"><ChevronRight size={22} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* --- LEFT: CALENDAR GRID (9 COLUMNS) --- */}
        <div className="xl:col-span-9">
          {/* Days Label */}
          <div className="grid grid-cols-7 mb-4">
            {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((day) => (
              <div key={day} className="text-center text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">{day}</div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 border border-border/40 rounded-[2.5rem] overflow-hidden bg-card/10 backdrop-blur-sm shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]">
            {eachDayOfInterval({
              start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
              end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
            }).map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[120px] md:min-h-[140px] p-2 border-r border-b border-border/20 transition-all relative cursor-pointer flex flex-col gap-1
                    ${!isCurrentMonth ? 'opacity-20 bg-foreground/[0.01]' : 'hover:bg-foreground/[0.03]'}
                    ${isSelected ? 'bg-neon-cyan/[0.04]' : ''}
                  `}
                >
                  <span className={`text-xs font-bold w-8 h-8 flex items-center justify-center rounded-xl mb-1 transition-all
                    ${isToday ? 'bg-neon-cyan text-white shadow-[0_0_15px_rgba(34,211,238,0.5)] scale-110' : ''}
                    ${isSelected && !isToday ? 'bg-foreground text-background' : 'text-muted-foreground'}
                  `}>{format(day, 'd')}</span>

                  {/* Multi-day Bars Logic */}
                  <div className="flex flex-col gap-1.5 w-full">
                    {dayEvents.slice(0, 3).map(event => {
                      const isStart = isSameDay(day, event.start);
                      const isEnd = isSameDay(day, event.end || event.start);
                      const isMonday = day.getDay() === 1;

                      return (
                        <div key={event.id} className={`
                          text-[9px] h-6 flex items-center px-2 font-bold transition-all relative z-10
                          ${event.color === 'neon-purple' ? 'bg-neon-purple/20 text-neon-purple' : ''}
                          ${event.color === 'neon-cyan' ? 'bg-neon-cyan/20 text-neon-cyan' : ''}
                          ${event.color === 'red-500' ? 'bg-red-500/20 text-red-500' : ''}
                          
                          ${isStart ? 'rounded-l-lg ml-1 border-l border-white/10' : ''}
                          ${isEnd ? 'rounded-r-lg mr-1 border-r border-white/10' : ''}
                          ${!isStart && !isEnd ? 'opacity-90' : ''}
                          border-y border-white/5 shadow-sm
                        `}>
                          {(isStart || (isMonday && !isStart)) && (
                            <span className="truncate drop-shadow-sm">{event.title}</span>
                          )}
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <div className="text-[8px] text-neon-cyan font-black pl-2 tracking-tighter italic">+{dayEvents.length - 3} sự kiện khác</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- RIGHT: SIDEBAR DETAILS (3 COLUMNS) --- */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-card/40 backdrop-blur-3xl border border-border/60 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border-t-neon-cyan/30">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-cyan/10 blur-[50px] rounded-full group-hover:bg-neon-cyan/20 transition-all duration-700" />
             
             <div className="relative z-10">
               <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 text-muted-foreground">
                  <Clock size={18} className="text-neon-cyan" />
                  Ngày {format(selectedDate, 'dd')} THÁNG {format(selectedDate, 'MM')}
               </h2>

               <div className="space-y-4">
                  {selectedDayEvents.length > 0 ? (
                    selectedDayEvents.map(event => (
                      <div key={event.id} className="group/item relative p-5 rounded-2xl bg-foreground/[0.03] border border-border/50 hover:border-neon-cyan/40 hover:bg-foreground/[0.05] transition-all cursor-pointer">
                         <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full
                            ${event.color === 'neon-purple' ? 'bg-neon-purple' : ''}
                            ${event.color === 'neon-cyan' ? 'bg-neon-cyan' : ''}
                            ${event.color === 'red-500' ? 'bg-red-500' : ''}
                         `} />
                         <p className="text-[10px] font-black text-muted-foreground/60 uppercase mb-2 tracking-widest">
                           {event.time || "Cả ngày"}
                         </p>
                         <h4 className="text-sm font-bold leading-snug group-hover/item:text-neon-cyan transition-colors line-clamp-2">
                           {event.title}
                         </h4>
                      </div>
                    ))
                  ) : (
                    <div className="py-16 flex flex-col items-center justify-center text-center px-4 border-2 border-dashed border-border/40 rounded-[2rem]">
                      <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mb-4 text-muted-foreground/30">
                        <AlertCircle size={24} />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium italic">Không có kế hoạch nào cho ngày này</p>
                    </div>
                  )}
               </div>

               <button className="w-full mt-8 py-5 bg-foreground text-background rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] hover:-translate-y-1 active:scale-95 transition-all group">
                  <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
                  TẠO LỊCH TRÌNH MỚI
               </button>
             </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-linear-to-br from-neon-purple/20 to-neon-cyan/20 border border-white/5 backdrop-blur-lg">
             <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Mẹo năng suất</span>
             </div>
             <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                Bạn có thể nhấn vào bất kỳ sự kiện nào để xem chi tiết hoặc thay đổi thời gian bằng cách kéo thả trực tiếp (đang phát triển).
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
