'use client'
import { useState, useEffect } from 'react';
import { ShieldCheck, Globe, MapPin, Monitor } from 'lucide-react';
import { getClientData } from './useClientInfo'; 

export default function ClientTracker() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getClientData().then(setData);
  }, []);

  if (!data) return (
    <div className="flex items-center justify-center p-8 text-emerald-500 animate-pulse font-bold tracking-widest">
      ĐANG KHỞI TẠO HỆ THỐNG...
    </div>
  );

  // Xử lý định dạng dữ liệu
  const formattedCity = data.city ? decodeURIComponent(data.city).replace(/\+/g, ' ') : 'N/A';
  const formattedUA = data.ua || 'N/A';

  return (
    <div className="max-w-md mx-auto p-6 rounded-[2rem] bg-emerald-500 text-white shadow-[0_20px_50px_rgba(16,185,129,0.3)] border border-white/20 backdrop-blur-md">
      <h2 className="text-base font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
        <ShieldCheck size={22} className="text-emerald-200" />
        Hệ thống truy cập
      </h2>

      <div className="space-y-4">
        {/* Địa chỉ IP */}
        <div className="group p-4 rounded-2xl bg-white/10 border border-white/5 transition-all hover:bg-white/15">
          <div className="flex items-center gap-3 mb-1">
            <Globe size={14} className="opacity-60" />
            <p className="opacity-60 text-[10px] uppercase font-black tracking-widest">Địa chỉ IP</p>
          </div>
          <p className="font-mono text-sm font-bold pl-7 tracking-wider">{data.ip}</p>
        </div>

        {/* Vị trí - Đã fix lỗi %20 */}
        <div className="group p-4 rounded-2xl bg-white/10 border border-white/5 transition-all hover:bg-white/15">
          <div className="flex items-center gap-3 mb-1">
            <MapPin size={14} className="opacity-60" />
            <p className="opacity-60 text-[10px] uppercase font-black tracking-widest">Vị trí Vercel Edge</p>
          </div>
          <p className="text-sm font-bold pl-7 leading-tight">
            {formattedCity}{data.country ? `, ${data.country}` : ''}
          </p>
        </div>

        {/* Thiết bị - Hiển thị đầy đủ nội dung */}
        <div className="group p-4 rounded-2xl bg-white/10 border border-white/5 transition-all hover:bg-white/15">
          <div className="flex items-center gap-3 mb-1">
            <Monitor size={14} className="opacity-60" />
            <p className="opacity-60 text-[10px] uppercase font-black tracking-widest">Thông tin thiết bị</p>
          </div>
          {/* break-words và không có line-clamp để hiện đầy đủ */}
          <p className="text-[11px] font-medium pl-7 leading-relaxed opacity-90 break-words">
            {formattedUA}
          </p>
        </div>
      </div>

      <div className="mt-6 text-[9px] uppercase tracking-[0.3em] opacity-40 text-center font-bold">
        Securely Handled by Stoic System
      </div>
    </div>
  );
}
