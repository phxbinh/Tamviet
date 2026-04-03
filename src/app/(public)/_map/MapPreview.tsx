'use client'
import { useRouter } from 'next/navigation';
import { MapPin, Navigation, Map as MapIcon, ExternalLink } from 'lucide-react';

interface Props {
  lat: number;
  lng: number;
  shopName: string;
  address: string;
}


export default function MapPreview({
  lat,
  lng,
  shopName,
  address,
}: Props) {
  const router = useRouter();

  // Điều hướng nội bộ (Trang Map của bạn)
  const handleViewMap = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện click của thẻ cha
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      name: shopName,
      address: address
    });
    router.push(`/map?${params.toString()}`);
  };

  // Mở Google Maps bên ngoài để chỉ đường
  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const url = isIOS
      ? `maps://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(shopName)}`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div
      onClick={handleViewMap}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-emerald-400/20 bg-emerald-500 shadow-xl transition-all duration-300 hover:bg-emerald-600 hover:shadow-emerald-500/30"
    >
      <div className="flex flex-col p-4">
        
        {/* Header: ShopName + Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            {/* Icon vị trí bây giờ màu trắng để nổi bật trên nền xanh */}
            <MapPin size={18} className="text-white shrink-0 animate-pulse" />
            <h3 className="truncate uppercase tracking-tight font-bold text-white text-sm md:text-base">
              {shopName}
            </h3>
          </div>
  
          {/* Nhóm nút chức năng */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Nút Xem bản đồ nội bộ: Chỉnh lại để hòa hợp với nền mới */}
            <button
              onClick={ handleViewMap }
              title="Xem bản đồ"
              className="p-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
            >
              <MapIcon size={14} />
            </button>
  
            {/* Nút Chỉ đường: Màu trắng để tạo điểm nhấn (Brand accent) */}
            <button
              onClick={ handleGetDirections }
              title="Chỉ đường"
              className="p-2 rounded-lg bg-white text-emerald-600 shadow-lg hover:scale-110 active:scale-95 transition-transform"
            >
              <Navigation size={14} fill="currentColor" />
            </button>
          </div>
        </div>
  
        {/* Address: Màu trắng mờ (opacity) để phân cấp thông tin */}
        <p className="text-xs md:text-sm text-emerald-50 leading-relaxed italic break-words pr-2 opacity-90">
          {address}
        </p>
  
      </div>
    </div>
  );
}

