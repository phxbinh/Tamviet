
'use client';

import React, { useMemo } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface StoreMapProps {
  address: string;
  lat: number;
  lng: number;
  shopName: string;
}

const StoreMap = ({ address, lat, lng, shopName }: StoreMapProps) => {

  const mapUrl = useMemo(() => {
    const encodedName = encodeURIComponent(shopName);
    return `https://maps.google.com/maps?q=${encodedName}%20@${lat},${lng}&z=16&output=embed`;
  }, [lat, lng, shopName]);

  const handleOpenMap = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const encodedName = encodeURIComponent(shopName);

    const url = isIOS
      ? `maps://maps.apple.com/?daddr=${lat},${lng}&q=${encodedName}`
      : `https://www.google.com/maps?daddr=${lat},${lng}`;

    window.open(url, '_blank');
  };

  return (
    <div className="group w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f0f] shadow-2xl flex flex-col">

      {/* Map */}
      <iframe
        title="Store Location"
        className="w-full h-[260px] border-0 shadow-inner rounded-t-2xl rounded-b-none"
        loading="lazy"
        src={mapUrl}
      />

      {/* Info Card */} {/*
      <div
        onClick={handleOpenMap}
        className="p-3 md:p-4 border-t border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 cursor-pointer rounded-b-2xl rounded-t-none group/card"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1 overflow-hidden">
            <h3 className="text-white font-semibold flex items-center gap-2 truncate">
              <MapPin size={18} className="text-emerald-500 shrink-0 animate-pulse" />
              <span className="truncate uppercase tracking-tight">{shopName}</span>
            </h3>
            <p className="text-green-400 text-sm truncate font-bold italic">
              {address}
            </p>
          </div>

          <div className="flex flex-col items-center shrink-0 ml-4">
            <div className="p-3 rounded-full bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-transform group-hover/card:scale-110">
              <Navigation size={18} fill="currentColor" />
            </div>
            <span className="text-[9px] text-emerald-500 font-black mt-1 uppercase tracking-widest">
              Đường đi
            </span>
          </div>
        </div>
      </div>*/}
{/* Info Card */}
<div
  onClick={handleOpenMap}
  className="p-3 md:p-4 border-t border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 cursor-pointer rounded-b-2xl rounded-t-none group/card"
>
  <div className="flex items-start justify-between gap-3">
    
    {/* LEFT */}
    <div className="space-y-1 min-w-0 flex-1">
      
      {/* Shop name */}
      <h3 className="text-white font-semibold flex items-center gap-2">
        <MapPin size={18} className="text-emerald-500 shrink-0 animate-pulse" />
        <span className="truncate uppercase tracking-tight">
          {shopName}
        </span>
      </h3>

      {/* Address */}
      <p className="text-green-400 text-sm font-bold italic break-words leading-snug">
        {address}
      </p>
    </div>

    {/* RIGHT */}
    <div className="flex flex-col items-center justify-start shrink-0">
      <div className="p-3 rounded-full bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-transform group-hover/card:scale-110">
        <Navigation size={18} fill="currentColor" />
      </div>

      <span className="text-[9px] text-emerald-500 font-black mt-1 uppercase tracking-widest text-center">
        Đường đi
      </span>
    </div>

  </div>
</div>

    </div>
  );
};

export default StoreMap;




