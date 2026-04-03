'use client'
import { useClientInfo } from './useClientInfo';
import { Monitor, MapPin, Globe, ShieldCheck } from 'lucide-react';

export default function ClientTracker() {
  const { info, loading } = useClientInfo();

  if (loading) return <div className="p-4 text-emerald-500 animate-pulse">Đang quét hệ thống...</div>;

  return (
    <div className="max-w-md p-6 rounded-2xl bg-emerald-500 text-white shadow-2xl border border-white/20">
      <h2 className="text-lg font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
        <ShieldCheck size={20} /> Hệ thống truy cập
      </h2>

      <div className="space-y-4 text-sm">
        {/* Thiết bị */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10">
          <Monitor size={18} className="shrink-0" />
          <div>
            <p className="opacity-70 text-[10px] uppercase font-bold">Thiết bị & Trình duyệt</p>
            <p className="font-medium line-clamp-1">{info?.device} - {info?.browser}</p>
          </div>
        </div>

        {/* Địa chỉ IP & Nhà mạng */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10">
          <Globe size={18} className="shrink-0" />
          <div>
            <p className="opacity-70 text-[10px] uppercase font-bold">Mạng (IP: {info?.ip})</p>
            <p className="font-medium">{info?.isp}</p>
          </div>
        </div>

        {/* Vị trí địa lý */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10">
          <MapPin size={18} className="shrink-0" />
          <div>
            <p className="opacity-70 text-[10px] uppercase font-bold">Vị trí hiện tại</p>
            <p className="font-medium">{info?.city}, {info?.region}, {info?.country}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 text-[10px] italic opacity-60 text-right">
        Dữ liệu được bảo mật bởi Stoic System
      </div>
    </div>
  );
}
