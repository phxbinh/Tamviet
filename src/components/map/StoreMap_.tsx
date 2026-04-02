
'use client';

import React from 'react';
import { MapPin, Navigation } from 'lucide-react';


interface StoreMapProps {
  address: string;
  lat?: number;
  lng?: number;
  shopName: string;
}

const StoreMap = ({ address, lat, lng, shopName }: StoreMapProps) => {
  const encodedAddress = encodeURIComponent(address);
  
  const handleOpenMap = () => {
    // URL chuẩn để mở ứng dụng Bản đồ trên thiết bị
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    const appleMapsUrl = `maps://maps.apple.com/?q=${encodedAddress}`;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    window.open(isIOS ? appleMapsUrl : googleMapsUrl, '_blank');
  };

  const handleOpenMap_ = () => {
    // Tự động chuyển hướng dựa trên thiết bị (iOS ưu tiên Apple Maps)
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    const appleMapsUrl = `maps://maps.apple.com/?daddr=${lat},${lng}`;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    window.open(isIOS ? appleMapsUrl : googleMapsUrl, '_blank');
  };

  return (
    <div className="group relative w-full h-[350px] rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f0f] shadow-2xl">
      
  
      <iframe
        title="Store Location"
        width="100%"
        height="100%"
        style={{ 
          border: 0, 
          //filter: 'grayscale(1) invert(0.92) contrast(0.85)' // Biến Map sang Dark Mode sang trọng
        }}
        loading="lazy"
        src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
      />

    
      <div 
        onClick={handleOpenMap}
        className="absolute inset-0 cursor-pointer bg-transparent"
      />

    
      <div onClick={handleOpenMap_} className="absolute bottom-6 left-6 right-6 p-5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/40">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <MapPin size={18} className="text-emerald-500" />
              {shopName}
            </h3>
            <p className="text-green-400 text-sm max-w-[200px] truncate md:max-w-none">
              {address}
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="p-3 rounded-full bg-emerald-500 text-black shadow-lg transition-transform group-hover:scale-110">
              <Navigation size={18} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreMap;




