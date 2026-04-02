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
  
  const handleOpenMap = () => {
    // Tự động chuyển hướng dựa trên thiết bị (iOS ưu tiên Apple Maps)
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    const appleMapsUrl = `maps://maps.apple.com/?daddr=${lat},${lng}`;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    window.open(isIOS ? appleMapsUrl : googleMapsUrl, '_blank');
  };

  return (
    <div 
      onClick={handleOpenMap}
      className="group relative w-full h-[400px] rounded-2xl overflow-hidden cursor-pointer border border-white/10 shadow-2xl transition-all duration-500 hover:border-emerald-500/50"
    >
      {/* Map Background Placeholder - Thay URL bằng Static Map API của Google hoặc Mapbox */}
      <div 
        className="absolute inset-0 bg-cover bg-center grayscale-[20%] transition-transform duration-700 group-hover:scale-105"
        style={{ 
          backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-s+059669(${lng},${lat})/${lng},${lat},15/1200x800?access_token=YOUR_TOKEN')`,
          backgroundColor: '#1a1a1a' 
        }}
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

      {/* Glassmorphism Info Card */}
      <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-white font-medium tracking-wide flex items-center gap-2">
              <MapPin size={18} className="text-emerald-400" />
              {shopName}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[250px]">
              {address}
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <div className="p-3 rounded-full bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:scale-110 transition-transform">
              <Navigation size={20} fill="currentColor" />
            </div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Chỉ đường</span>
          </div>
        </div>
      </div>

      {/* Hiệu ứng tia sáng quét qua khi hover */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -inset-[100%] w-[200%] h-[200%] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
};

export default StoreMap;
