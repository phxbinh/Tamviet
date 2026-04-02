'use client';

import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface StoreMapProps {
  address: string;
  lat: number;
  lng: number;
  shopName: string;
}

const StoreMap = ({ address, lat, lng, shopName }: StoreMapProps) => {
  // query dùng cho việc tìm kiếm text hoặc hiển thị tên
  const query = encodeURIComponent(`${shopName}`);

  const handleOpenMap = () => {
    // Ưu tiên dùng tọa độ để mở app, sẽ chính xác 100%
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const appleMapsUrl = `maps://maps.apple.com/?q=${query}&ll=${lat},${lng}`;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    window.open(isIOS ? appleMapsUrl : googleMapsUrl, '_blank');
  };

  return (
    <div className="group relative w-full h-[350px] rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f0f] shadow-2xl">
      
      {/* NHÚNG LAT/LNG VÀO ĐÂY: t=&z=15 là độ zoom, q=${lat},${lng} để cắm ghim */}
      <iframe
        title="Store Location"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        src={`https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
      />

      {/* Lớp phủ chặn tương tác Iframe để ưu tiên click mở App */}
      <div 
        onClick={handleOpenMap}
        className="absolute inset-0 cursor-pointer bg-transparent"
      />

      {/* UI Card */}
      <div 
        onClick={(e) => {
          e.stopPropagation(); // Ngăn nổi bọt để không trigger handleOpenMap 2 lần
          handleOpenMap();
        }} 
        className="absolute bottom-6 left-6 right-6 p-5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 hover:bg-emerald-500/20 hover:border-emerald-500/40 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <MapPin size={18} className="text-emerald-500" />
              {shopName}
            </h3>
            <p className="text-gray-300 text-sm max-w-[200px] truncate md:max-w-none">
              {address}
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="p-3 rounded-full bg-emerald-500 text-black shadow-lg transition-transform group-hover:scale-110">
              <Navigation size={18} fill="currentColor" />
            </div>
            <span className="text-[10px] text-emerald-400 font-bold mt-1 uppercase">Chỉ đường</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreMap;
