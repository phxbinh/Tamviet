'use client';

import React, { useState } from 'react';
import DailyReportSchedule from './DailyReportSchedule'; // Đường dẫn tới component bạn vừa tạo

export default function DailySchedulePage() {
  // Page quản lý state tập trung ở đây
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase tracking-widest text-neon-cyan">
          Báo cáo công việc
        </h1>
        {/* Bạn có thể thêm bộ chọn ngày ở đây nếu muốn */}
      </div>

      {/* Gọi Component đã tách ra */}
      <DailyReportSchedule selectedDate={selectedDate} />
    </div>
  );
}
