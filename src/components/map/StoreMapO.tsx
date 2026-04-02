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
  const mapUrl = useMemo(() => {
    const encodedName = encodeURIComponent(shopName);
    return `https://maps.google.com/maps?q=${lat},${lng}(${encodedName})&t=&z=${zoom}&ie=UTF8&iwloc=B&output=embed`;
  }, [lat, lng, zoom, shopName]);

  const handleOpenMap = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const encodedName = encodeURIComponent(shopName);
    
    const url = isIOS 
      ? `maps://maps.apple.com/?daddr=${lat},${lng}&q=${encodedName}` 
      : `https://www.google.com/maps?daddr=${lat},${lng}`;
    
    window.open(url, '_blank');
  };

  const changeZoom = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(Math.max(prev + delta, 1), 21));
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

      {/* Zoom Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
        {[
          { icon: Plus, act: 1 },
          { icon: Minus, act: -1 }
        ].map((btn, i) => (
          <button
            key={i}
            onClick={(e) => changeZoom(e, btn.act)}
            className="p-2 bg-black/70 backdrop-blur-md border border-white/10 rounded-lg text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all active:scale-90"
          >
            <btn.icon size={20} />
          </button>
        ))}
      </div>

      {/* 3. Labels */}
      <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-gray-300 border border-white/10 uppercase tracking-widest pointer-events-none z-10">
        Zoom: {zoom}
      </div>

      {/* Click Overlay */}
      <div className="absolute inset-0 cursor-pointer z-0" onClick={handleOpenMap} />

      {/* Info Card */}
      <div 
        onClick={(e) => { e.stopPropagation(); handleOpenMap(); }} 
        className="absolute bottom-6 left-6 right-6 p-5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 hover:bg-emerald-500/20 hover:border-emerald-500/40 cursor-pointer z-10"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1 overflow-hidden">
            <h3 className="text-white font-semibold flex items-center gap-2 truncate">
              <MapPin size={18} className="text-emerald-500 shrink-0" />
              <span className="truncate">{shopName}</span>
            </h3>
            <p className="text-gray-300 text-sm truncate">{address}</p>
          </div>
          
          <div className="flex flex-col items-center shrink-0 ml-4">
            <div className="p-3 rounded-full bg-emerald-500 text-black shadow-lg transition-transform group-hover:rotate-12">
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
