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
  Clock, Plus, AlertCircle, CheckCircle2, Circle, Tag
} from 'lucide-react';

// 1. INTERFACE
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: string;
  color: string;
  time?: string;
  isCompleted: boolean;
}

// 2. MOCK DATA (Chuẩn ngày 05/03/2026)
const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Họp chiến lược Tâm Việt',
    start: new Date(2026, 2, 6, 10, 0), 
    end: new Date(2026, 2, 6, 11, 30),
    time: '10:00 - 11:30',
    type: 'meeting',
    color: 'neon-purple',
    isCompleted: false
  },
  {
    id: 'multi-1',
    title: '🚀 Sprint: Hoàn thiện Dashboard',
    start: new Date(2026, 2, 9),  
    end: new Date(2026, 2, 13),    
    type: 'project',
    color: 'neon-cyan',
    time: 'Cả tuần',
    isCompleted: false
  },
  {
    id: 'multi-2',
    title: '🏝️ Nghỉ phép năm',
    start: new Date(2026, 2, 14), 
    end: new Date(2026, 2, 16),   
    type: 'vacation',
    color: 'red-500',
    isCompleted: false
  },
  {
    id: 'multi-3',
    title: 'Họp chiến lược Việt',
    start: new Date(2026, 2, 5, 10, 0), 
    end: new Date(2026, 2, 5, 11, 30),
    time: '10:00 - 11:30',
    type: 'meeting',
    color: 'neon-purple',
    isCompleted: false
  },
  {
    id: 'multi-4',
    title: '🚀 Sprint: Hoàn thiện',
    start: new Date(2026, 2, 1),  
    end: new Date(2026, 2, 6), 
    type: 'project',
    color: 'neon-cyan',
    isCompleted: false
  }
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);

  // --- LOGIC HELPER ---
  const toggleComplete = (id: string) => {
    setEvents(prev => prev.map(ev => 
      ev.id === id ? { ...ev, isCompleted: !ev.isCompleted } : ev
    ));
  };

  const getUrgency = (event: CalendarEvent) => {
    if (event.isCompleted) return 'none';
    const now = new Date();
    const hoursToDeadline = differenceInHours(event.end, now);
    if (hoursToDeadline < 0) return 'overdue';
    if (hoursToDeadline <= 12) return 'danger';
    if (hoursToDeadline <= 48) return 'warning';
    return 'normal';
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

  // Logic lấy sự kiện cho một ngày cụ thể
  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isWithinInterval(startOfDay(day), {
        start: startOfDay(event.start),
        end: endOfDay(event.end || event.start)
      })
    );
  };

  const selectedDayEvents = useMemo(() => getEventsForDay(selectedDate), [events, selectedDate]);

  return (
    <div className="max-w-[1500px] mx-auto p-4 md:p-6 animate-in fade-in duration-700">
      
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
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">Hệ thống giám sát Deadline</p>
            </div>
        </div>

        <div className="flex items-center gap-3 bg-card/30 backdrop-blur-2xl border border-border/50 p-2 rounded-2xl shadow-2xl">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2.5 hover:bg-foreground/10 rounded-xl transition-all active:scale-90"><ChevronLeft size={22} /></button>
          <button onClick={() => setCurrentMonth(new Date())} className="px-6 py-2 text-xs font-black hover:bg-foreground/10 rounded-xl transition-all uppercase tracking-widest border border-transparent hover:border-border">Hôm nay</button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2.5 hover:bg-foreground/10 rounded-xl transition-all active:scale-90"><ChevronRight size={22} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* --- LEFT: CALENDAR GRID --- */}
        <div className="xl:col-span-8">
          <div className="grid grid-cols-7 mb-4 px-2">
            {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map((day) => (
              <div key={day} className="text-center text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 border border-border/40 rounded-[2.5rem] overflow-hidden bg-card/10 backdrop-blur-sm shadow-2xl">
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
                  className={`min-h-[110px] md:min-h-[130px] p-2 border-r border-b border-border/20 transition-all relative cursor-pointer
                    ${!isCurrentMonth ? 'opacity-20 bg-foreground/[0.01]' : 'hover:bg-foreground/[0.03]'}
                    ${isSelected ? 'bg-neon-cyan/[0.05]' : ''}
                  `}
                >
                  <span className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-lg mb-2 transition-all
                    ${isToday ? 'bg-neon-cyan text-white shadow-lg' : ''}
                    ${isSelected && !isToday ? 'bg-foreground text-background' : 'text-muted-foreground'}
                  `}>{format(day, 'd')}</span>

                  <div className="flex flex-col gap-1 w-full overflow-hidden">
                    {dayEvents.map(event => {
                       const isStart = isSameDay(day, event.start);
                       const isEnd = isSameDay(day, event.end || event.start);
                       const isMonday = day.getDay() === 1;

                       return (
                         <div key={event.id} className={`
                           text-[8px] h-4 flex items-center px-1.5 font-bold truncate transition-all border-y border-white/5
                           ${event.color === 'neon-purple' ? 'bg-neon-purple/20 text-neon-purple' : ''}
                           ${event.color === 'neon-cyan' ? 'bg-neon-cyan/20 text-neon-cyan' : ''}
                           ${event.color === 'red-500' ? 'bg-red-500/20 text-red-500' : ''}
                           ${event.isCompleted ? 'opacity-30 line-through' : ''}
                           ${isStart ? 'rounded-l-md ml-0.5 border-l' : ''}
                           ${isEnd ? 'rounded-r-md mr-0.5 border-r' : ''}
                         `}>
                           {(isStart || (isMonday && !isStart)) && event.title}
                         </div>
                       );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- RIGHT: SIDEBAR DETAILS --- */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-card/40 backdrop-blur-3xl border border-border/60 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-cyan/10 blur-[50px] rounded-full group-hover:bg-neon-cyan/20 transition-all duration-700" />
             
             <div className="relative z-10">
               <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3 text-muted-foreground">
                  <Clock size={18} className="text-neon-cyan" />
                  Ngày {format(selectedDate, 'dd')} THÁNG {format(selectedDate, 'MM')}
               </h2>

               <div className="space-y-4 max-h-[500px] overflow-y-auto py-6 pr-2 custom-scrollbar">
                  {selectedDayEvents.length > 0 ? (
                    selectedDayEvents.map(event => {
                      const urgency = getUrgency(event);
                      const urgencyClass = getUrgencyClass(urgency);

                      return (
                        <div key={event.id} className={`group/item relative p-5 rounded-3xl border transition-all duration-500
                          ${event.isCompleted ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-foreground/[0.03] border-border/50 hover:border-neon-cyan/40'}
                        `}>
                           {!event.isCompleted && (
                             <div className={`absolute -right-1 -top-1 w-4 h-4 rounded-full border-2 border-background z-20 ${urgencyClass}`} />
                           )}

                           <div className="flex items-start gap-4">
                              <button onClick={() => toggleComplete(event.id)} className={`mt-1 transition-all active:scale-75 ${event.isCompleted ? 'text-emerald-500' : 'text-muted-foreground/40 hover:text-neon-cyan'}`}>
                                {event.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                              </button>

                              <div className="flex-1 overflow-hidden">
                                 <div className="flex justify-between items-center mb-1">
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border 
                                      ${event.isCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-foreground/10 border-border text-muted-foreground'}
                                    `}>
                                       {event.isCompleted ? 'Xong' : urgency === 'danger' ? 'GẤP' : 'Dự án'}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-bold">{event.time}</span>
                                 </div>
                                 <h4 className={`text-sm font-bold truncate transition-all ${event.isCompleted ? 'text-muted-foreground/50 line-through' : ''}`}>
                                   {event.title}
                                 </h4>
                              </div>
                           </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-16 text-center border-2 border-dashed border-border/40 rounded-[2rem]">
                      <AlertCircle className="mx-auto mb-2 text-muted-foreground/30" size={24} />
                      <p className="text-xs text-muted-foreground italic">Trống lịch trình</p>
                    </div>
                  )}
               </div>

               <button className="w-full mt-8 py-5 bg-foreground text-background rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:translate-y-[-4px] transition-all">
                  <Plus size={18} /> THÊM NHIỆM VỤ MỚI
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
