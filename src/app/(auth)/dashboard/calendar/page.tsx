'use client';

import React, { useState, useMemo } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval 
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Tag } from 'lucide-react';

// --- MOCK DATA (Đặt bên ngoài để dễ quản lý) ---
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Họp chiến lược Tâm Việt',
    date: new Date(2026, 2, 5), // Tháng 3 (index 2), ngày 5, năm 2026
    time: '10:00 - 11:30',
    type: 'meeting',
    color: 'neon-purple'
  },
  {
    id: '2',
    title: 'Hoàn thành UI Calendar',
    date: new Date(2026, 2, 10),
    time: '09:00 - 17:00',
    type: 'task',
    color: 'neon-cyan'
  },
  {
    id: '3',
    title: 'Deadline Nộp Báo Cáo',
    date: new Date(2026, 2, 5),
    time: '23:59',
    type: 'urgent',
    color: 'red-500'
  }
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(MOCK_EVENTS);

  // Lọc sự kiện cho ngày đang được chọn ở cột phải
  const selectedDayEvents = useMemo(() => {
    return events.filter(event => isSameDay(event.date, selectedDate));
  }, [events, selectedDate]);

  // Hàm helper để lấy sự kiện của một ngày bất kỳ trên ô lịch
  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center text-neon-cyan border border-neon-cyan/20 shadow-lg shadow-neon-cyan/10">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold capitalize leading-none mb-1">
              {format(currentMonth, 'MMMM yyyy', { locale: vi })}
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Quản lý tiến độ thời gian</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-card/40 backdrop-blur-xl border border-border p-1.5 rounded-2xl shadow-sm">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-foreground/5 rounded-xl transition-all"><ChevronLeft size={20} /></button>
          <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-1.5 text-xs font-bold hover:bg-foreground/10 rounded-xl transition-all uppercase tracking-tighter">Hôm nay</button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-foreground/5 rounded-xl transition-all"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* LEFT: MAIN CALENDAR */}
        <div className="xl:col-span-3 space-y-2">
          {/* Days Header (T2 - CN) */}
          <div className="grid grid-cols-7 mb-2">
            {['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'].map((day) => (
              <div key={day} className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest py-2">{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 border border-border/50 rounded-[2rem] overflow-hidden bg-card/20 backdrop-blur-sm shadow-2xl">
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
                  className={`min-h-[110px] p-2 border-r border-b border-border/30 transition-all relative group cursor-pointer
                    ${!isCurrentMonth ? 'opacity-20 bg-foreground/[0.02]' : 'hover:bg-foreground/[0.03]'}
                    ${isSelected ? 'bg-neon-cyan/[0.05]' : ''}
                  `}
                >
                  <span className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-lg mb-2
                    ${isToday ? 'bg-neon-cyan text-white shadow-lg shadow-neon-cyan/40' : ''}
                    ${isSelected && !isToday ? 'bg-foreground text-background' : ''}
                  `}>{format(day, 'd')}</span>

                  {/* Render Mini Events on Cell */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div key={event.id} className={`text-[9px] px-1.5 py-0.5 rounded-md border truncate font-medium
                        ${event.color === 'neon-purple' ? 'bg-neon-purple/10 border-neon-purple/20 text-neon-purple' : ''}
                        ${event.color === 'neon-cyan' ? 'bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan' : ''}
                        ${event.color === 'red-500' ? 'bg-red-500/10 border-red-500/20 text-red-500' : ''}
                      `}>
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[8px] text-muted-foreground pl-1 font-bold">+{dayEvents.length - 2} thêm...</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: DAY DETAILS */}
        <div className="space-y-6">
          <div className="bg-card/40 backdrop-blur-xl border border-border rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Tag size={40} className="text-neon-cyan" />
             </div>
             
             <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <Clock size={16} className="text-neon-cyan" />
                Lịch trình ngày {format(selectedDate, 'dd/MM')}
             </h2>

             <div className="space-y-4">
                {selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map(event => (
                    <div key={event.id} className="p-4 rounded-2xl bg-foreground/5 border border-border/50 hover:border-neon-cyan/50 transition-all group/item">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{event.time}</p>
                       <h4 className="text-sm font-bold group-hover/item:text-neon-cyan transition-colors">{event.title}</h4>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                    <p className="text-xs text-muted-foreground italic">Không có lịch trình nào</p>
                  </div>
                )}
             </div>

             <button className="w-full mt-6 py-4 bg-foreground text-background rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                <Plus size={16} /> THÊM SỰ KIỆN MỚI
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
