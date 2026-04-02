'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, Plus, Minus } from 'lucide-react';

interface StoreMapProps {
  address: string;
  lat: number;
  lng: number;
  shopName: string;
}

const StoreMap = ({ address, lat, lng, shopName }: StoreMapProps) => {
  const [zoom, setZoom] = useState(16);

  // Dùng URL gốc maps.google.com để đảm bảo ảnh bản đồ luôn hiện
  const mapUrl = useMemo(() => {
    const encodedName = encodeURIComponent(shopName);
    return `https://maps.google.com/maps?q=${lat},${lng}(${encodedName})&t=&z=${zoom}&ie=UTF8&iwloc=B&output=embed`;
  }, [lat, lng, zoom, shopName]);

  const handleOpenMap = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const encodedName = encodeURIComponent(shopName);
    const url = isIOS 
      ? `maps://maps.apple.com/?daddr=${lat},${lng}&q=${encodedName}` 
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="group relative w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-[#1a1a1a] shadow-2xl">
      {/* Iframe chuẩn - Fix lỗi không hiện ảnh */}
      <iframe 
        title="Store Location" 
        className="w-full h-full border-0" 
        loading="lazy" 
        src={mapUrl} 
      />

      {/* Cụm điều khiển Zoom Volume dọc */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-20 py-4 px-2 rounded-full bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl">
        <button onClick={(e) => { e.stopPropagation(); setZoom(p => Math.min(p + 1, 21)); }} className="text-emerald-500 hover:text-white transition-colors">
          <Plus size={16} />
        </button>
        <div className="relative h-28 w-6 flex items-center justify-center">
          <input
            type="range" min="1" max="21" step="1" value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            className="absolute cursor-pointer accent-emerald-500 w-24 h-1 bg-white/20 rounded-lg appearance-none -rotate-90 origin-center"
          />
        </div>
        <button onClick={(e) => { e.stopPropagation(); setZoom(p => Math.max(p - 1, 1)); }} className="text-emerald-500 hover:text-white transition-colors">
          <Minus size={16} />
        </button>
      </div>

      {/* Lớp phủ click mở App dẫn đường */}
      <div className="absolute inset-0 cursor-pointer z-0" onClick={handleOpenMap} />

      {/* Card thông tin Shop */}
      <div 
        onClick={(e) => { e.stopPropagation(); handleOpenMap(); }} 
        className="absolute bottom-6 left-6 right-6 p-5 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 cursor-pointer z-10"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1 overflow-hidden">
            <h3 className="text-white font-semibold flex items-center gap-2 truncate">
              <MapPin size={18} className="text-emerald-500 shrink-0" />
              <span className="truncate uppercase tracking-tight">{shopName}</span>
            </h3>
            <p className="text-gray-400 text-xs truncate font-light italic">{address}</p>
          </div>
          <div className="flex flex-col items-center shrink-0 ml-4">
            <div className="p-3 rounded-full bg-emerald-500 text-black shadow-lg">
              <Navigation size={18} fill="currentColor" />
            </div>
            <span className="text-[9px] text-emerald-500 font-black mt-1 uppercase tracking-widest">Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreMap;
