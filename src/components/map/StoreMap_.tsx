'use client';

import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface StoreMapProps {
  address: string;
  shopName: string;
}

const StoreMap = ({ address, shopName }: StoreMapProps) => {
  // Encode địa chỉ để đưa vào URL
  const encodedAddress = encodeURIComponent(address);
  
  // Link mở app bản đồ thực tế khi khách click
  const handleOpenMap = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    const appleMapsUrl = `maps://maps.apple.com/?q=${encodedAddress}`;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    window.open(isIOS ? appleMapsUrl : googleMapsUrl, '_blank');
  };

  return (
    <div className="group relative w-full h-[450px] rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shadow-2xl">
      
      {/* 1. Bản đồ Google Maps nhúng (Hoàn toàn miễn phí) */}
      <iframe
        title="Store Location"
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(0.8)' }} // Làm bản đồ tối đi cho sang
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/place?key=Mày_không_cần_Key_ở_đây_đâu_nhưng_dùng_URL_này_mới_chuẩn: https://www.google.com/maps?q=${encodedAddress}&output=embed`}
      ></iframe>

      {/* 2. Lớp phủ trong suốt để chặn tương tác cuộn vô tình trên map, chỉ cho click */}
      <div 
        onClick={handleOpenMap}
        className="absolute inset-0 cursor-pointer bg-transparent"
      />

      {/* 3. Card thông tin phong cách Glassmorphism */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] p-6 rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl pointer-events-none transition-all duration-500 group-hover:border-emerald-500/40">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <MapPin size={20} className="text-emerald-400" />
              {shopName}
            </h3>
            <p className="text-gray-300 text-sm italic">
              {address}
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 rounded-full bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
              <Navigation size={22} fill="currentColor" />
            </div>
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Chỉ đường</span>
          </div>
        </div>
      </div>

      {/* Hiệu ứng viền sáng chạy quanh khi hover cho đúng chất Next.js 15 */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-500/20 rounded-2xl pointer-events-none transition-all duration-700" />
    </div>
  );
};

export default StoreMap;
