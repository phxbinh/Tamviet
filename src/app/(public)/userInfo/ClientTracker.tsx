
'use client'
import { useState, useEffect } from 'react';
import { ShieldCheck, Globe, MapPin, Monitor, Navigation } from 'lucide-react';
import { getClientData } from './useClientInfo_'; 

export default function ClientTracker() {
  const [data, setData] = useState<any>(null);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Lấy data từ Server (IP, City từ Vercel)
    getClientData().then(setData);

    // 2. Xin quyền truy cập vị trí chính xác (GPS)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setGeoError("Người dùng từ chối hoặc GPS bị tắt");
          console.warn("Lỗi Geolocation:", error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  if (!data) return <div className="p-4 text-emerald-500 animate-pulse font-bold">ĐANG QUÉT...</div>;

  const formattedCity = data.city ? decodeURIComponent(data.city).replace(/\+/g, ' ') : 'N/A';

  return (
    <div className="max-w-md mx-auto p-6 rounded-[2rem] bg-emerald-500 text-white shadow-2xl border border-white/20">
      <h2 className="text-base font-black uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
        <ShieldCheck size={22} className="text-emerald-200" />
        Hệ thống truy cập
      </h2>

      <div className="space-y-4">
        {/* IP & Mạng */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <Globe size={14} className="opacity-60" />
            <p className="opacity-60 text-[10px] uppercase font-black">Địa chỉ IP</p>
          </div>
          <p className="font-mono text-sm font-bold pl-7 italic">{data.ip}</p>
        </div>

        {/* Vị trí Chính xác (GPS) */}
        <div className={`p-4 rounded-2xl border transition-all ${coords ? 'bg-white/20 border-white/40' : 'bg-white/5 border-white/5 opacity-80'}`}>
          <div className="flex items-center gap-3 mb-1">
            <Navigation size={14} className={coords ? "text-white animate-bounce" : "opacity-60"} />
            <p className="opacity-60 text-[10px] uppercase font-black">Tọa độ GPS (Chính xác)</p>
          </div>
          <div className="pl-7">
            {coords ? (
              <p className="text-sm font-bold font-mono tracking-tighter">
                LAT: {coords.lat.toFixed(6)} | LNG: {coords.lng.toFixed(6)}
              </p>
            ) : (
              <p className="text-[10px] italic opacity-70">
                {geoError ? "Quyền truy cập bị từ chối" : "Đang chờ cấp quyền..."}
              </p>
            )}
          </div>
        </div>

        {/* Vị trí Tương đối (Vercel) */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <MapPin size={14} className="opacity-60" />
            <p className="opacity-60 text-[10px] uppercase font-black">Vùng (Edge)</p>
          </div>
          <p className="text-sm font-bold pl-7 leading-tight">
            {formattedCity}, {data.country}
          </p>
        </div>

        {/* Cấu hình thiết bị */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <Monitor size={14} className="opacity-60" />
            <p className="opacity-60 text-[10px] uppercase font-black">User Agent</p>
          </div>
          <p className="text-[10px] font-medium pl-7 leading-relaxed break-words opacity-90">
            {data.ua}
          </p>
        </div>
      </div>

      <div className="mt-6 text-[9px] uppercase tracking-[0.3em] opacity-40 text-center font-bold">
        Stoic Identity System
      </div>
    </div>
  );
}






