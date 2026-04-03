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

  // Memoize URL để tránh re-render iframe không cần thiết
/*
  const mapUrl = useMemo(() => {
    const encodedName = encodeURIComponent(shopName);
    return `https://maps.google.com/maps?q=${lat},${lng}(${encodedName})&t=&z=${zoom}&ie=UTF8&iwloc=B&output=embed`;
  }, [lat, lng, zoom, shopName]);
*/

const mapUrl = useMemo(() => {
  const encodedName = encodeURIComponent(shopName);
  return `https://maps.google.com/maps?q=${encodedName}%20@${lat},${lng}&z=${zoom}&output=embed`;
}, [lat, lng, zoom, shopName]);





  const handleOpenMap = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const encodedName = encodeURIComponent(shopName);
    
    const url = isIOS 
      ? `maps://maps.apple.com/?daddr=${lat},${lng}&q=${encodedName}` 
      : `https://www.google.com/maps?daddr=${lat},${lng}`;
    
    window.open(url, '_blank');
  };

  return (
    <div className="group relative w-full h-[350px] rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f0f] shadow-2xl transition-all">
      {/* Map Iframe */}
      <iframe
        title="Store Location"
        className="w-full h-full border-0 shadow-inner"
        loading="lazy"
        src={mapUrl}
      />

      {/* Info Card */}
      <div 
        onClick={(e) => { e.stopPropagation(); handleOpenMap(); }} 
        className="absolute bottom-2 left-6 right-6 p-1 md:p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 cursor-pointer z-10 group/card"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1 overflow-hidden">
            <h3 className="text-white font-semibold flex items-center gap-2 truncate">
              <MapPin size={18} className="text-emerald-500 shrink-0 animate-pulse" />
              <span className="truncate uppercase tracking-tight">{shopName}</span>
            </h3>
            <p className="text-green-400 text-s truncate font-bold italic">{address}</p>
          </div>
          <div className="flex flex-col items-center shrink-0 ml-4">
            <div className="p-3 rounded-full bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-transform group-hover/card:scale-110">
              <Navigation size={18} fill="currentColor" />
            </div>
            <span className="text-[9px] text-emerald-500 font-black mt-1 uppercase tracking-widest">Đường đi</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StoreMap;
