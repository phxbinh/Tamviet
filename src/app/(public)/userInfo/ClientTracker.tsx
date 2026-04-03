'use client'
import { useState, useEffect } from 'react';
import { getClientData } from './useClientInfo'; // Đường dẫn tới file action trên

export default function ClientTracker() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Gọi trực tiếp từ Server của bạn, không sợ bị chặn bởi trình duyệt
    getClientData().then(setData);
  }, []);

  if (!data) return <div className="p-4 text-emerald-500 animate-pulse">Đang kết nối...</div>;

  return (
    <div className="max-w-md p-6 rounded-2xl bg-emerald-500 text-white shadow-2xl border border-white/20">
      <h2 className="text-lg font-bold uppercase tracking-widest mb-4">Hệ thống truy cập</h2>
      <div className="space-y-4 text-sm">
        <div className="p-3 rounded-xl bg-white/10 border border-white/10">
          <p className="opacity-70 text-[10px] uppercase font-bold">Địa chỉ IP</p>
          <p className="font-medium">{data.ip}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/10 border border-white/10">
          <p className="opacity-70 text-[10px] uppercase font-bold">Vị trí (Từ Vercel Edge)</p>
          <p className="font-medium">{data.city}, {data.country}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/10 border border-white/10">
          <p className="opacity-70 text-[10px] uppercase font-bold">Thiết bị</p>
          <p className="font-medium line-clamp-1">{data.ua}</p>
        </div>
      </div>
    </div>
  );
}
