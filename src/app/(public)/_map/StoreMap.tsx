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

  const mapUrl = useMemo(() => {
    const encodedName = encodeURIComponent(shopName);
    return `https://developers.google.com/maps/documentation/embed/usage-and-billing5{lat},${lng}(${encodedName})&t=&z=${zoom}&ie=UTF8&iwloc=B&output=embed`;
  }, [lat, lng, zoom, shopName]);

  const handleOpenMap = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const url = isIOS 
      ? `maps://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(shopName)}` 
      : `https://www.google.com/maps?daddr=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="group relative w-full h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f0f] shadow-2xl">
      <iframe title="Store Location" className="w-full h-full border-0 shadow-inner" loading="lazy" src={mapUrl} />

      {/* --- BỘ ĐIỀU KHIỂN ZOOM KIỂU VOLUME --- */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-20 py-4 px-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
        <button onClick={(e) => { e.stopPropagation(); setZoom(p => Math.min(p + 1, 21)); }} className="text-emerald-500 hover:text-white transition-colors">
          <Plus size={16} />
        </button>
        
        <div className="relative h-32 w-6 flex items-center justify-center">
          <input
            type="range"
            min="1"
            max="21"
            step="1"
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            onClick={(e) => e.stopPropagation()}
            className="absolute cursor-pointer accent-emerald-500 w-28 h-1 bg-white/10 rounded-lg appearance-none -rotate-90 origin-center"
            style={{ WebkitAppearance: 'none' }}
          />
        </div>

        <button onClick={(e) => { e.stopPropagation(); setZoom(p => Math.max(p - 1, 1)); }} className="text-emerald-500 hover:text-white transition-colors">
          <Minus size={16} />
        </button>
      </div>

      {/* Click Overlay */}
      <div className="absolute inset-0 cursor-pointer z-0" onClick={handleOpenMap} />

      {/* Label Zoom */}
      <div className="absolute top-4 right-16 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] text-emerald-400 border border-emerald-500/20 uppercase font-bold tracking-tighter z-10 pointer-events-none">
        LVL: {zoom}
      </div>

      {/* Info Card */}
      <div 
        onClick={(e) => { e.stopPropagation(); handleOpenMap(); }} 
        className="absolute bottom-6 left-6 right-6 p-5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 cursor-pointer z-10 group/card"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1 overflow-hidden">
            <h3 className="text-white font-semibold flex items-center gap-2 truncate">
              <MapPin size={18} className="text-emerald-500 shrink-0 animate-pulse" />
              <span className="truncate uppercase tracking-tight">{shopName}</span>
            </h3>
            <p className="text-gray-400 text-xs truncate font-light italic">{address}</p>
          </div>
          <div className="flex flex-col items-center shrink-0 ml-4">
            <div className="p-3 rounded-full bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-transform group-hover/card:scale-110">
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
