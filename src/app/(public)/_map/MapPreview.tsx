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
/*
  return (
    <div
      onClick={handleViewMap}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 hover:border-emerald-500/40"
    >
      <div className="flex flex-col p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        
      
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin size={18} className="text-emerald-400 shrink-0 animate-breathe-slow" />
            <h3 className="truncate uppercase tracking-tight font-bold text-white text-sm md:text-base">
              {shopName}
            </h3>
          </div>

          
          <div className="flex items-center gap-2 shrink-0">
            
            <button
              onClick={handleViewMap}
              title="Xem bản đồ"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-emerald-500 hover:text-black transition-colors"
            >
              <MapIcon size={14} />
            </button>

          
            <button
              onClick={handleGetDirections}
              title="Chỉ đường"
              className="p-2 rounded-lg bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:scale-110 active:scale-90 transition-transform"
            >
              <Navigation size={14} fill="currentColor" />
            </button>
          </div>
        </div>

    
        <p className="text-xs md:text-sm text-gray-300 leading-relaxed italic break-words pr-2">
          {address}
        </p>

      </div>
    </div>
  );
*/

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














//export default 
function MapPreview_Ok_ok({
  lat,
  lng,
  shopName,
  address,
}: Props) {
  const router = useRouter();

  const handleNavigation = () => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      name: shopName,
      address: address
    });
    router.push(`/map?${params.toString()}`);
  };
  
  return (
    <div
      onClick={handleNavigation}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 hover:border-emerald-500/50"
    >
      {/* Container chính: dùng flex-col để giãn nở theo nội dung */}
      <div className="flex flex-col">
        
        {/* Info Section: Sử dụng Gradient và Flex để chứa tên & icon điều hướng */}
        <div className="bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {/* Tên Shop */}
              <div className="flex items-center gap-2 font-bold text-white mb-2">
                {/* Sử dụng animation animate-breathe-slow từ globals.css */}
                <MapPin size={18} className="text-emerald-400 shrink-0 animate-breathe-slow" />
                <span className="truncate uppercase tracking-tight text-sm md:text-base">
                  {shopName}
                </span>
              </div>

              {/* Địa chỉ: HIỆN ĐẦY ĐỦ, KHÔNG CẮT BỚT */}
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed italic break-words">
                {address}
              </p>
            </div>

            {/* Icon Button (Visual feedback giống số 2) */}
            <div className="shrink-0">
              <div className="p-2.5 rounded-full bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform group-hover:scale-110 active:scale-90">
                <Navigation size={16} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
  
        {/* Bottom Bar: Nút bấm giả để tăng trải nghiệm người dùng */}
        <div className="px-4 pb-4 pt-2">
          <div className="w-full rounded-xl bg-emerald-500/10 border border-emerald-500/20 py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 transition-all group-hover:bg-emerald-500 group-hover:text-black">
            Xem đường đi chi tiết
          </div>
        </div>
      </div>
    </div>
  );
}











//export default
function MapPreview__ok_({
  lat,
  lng,
  shopName,
  address,
}: Props) {
  const router = useRouter();

  const handleNavigation = () => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      name: shopName,
      address: address
    });
    router.push(`/map?${params.toString()}`);
  };
  
  return (
    <div
      onClick={handleNavigation}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 hover:border-emerald-500/40"
    >
      {/* Content Container */}
      <div className="bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4">
        <div className="flex items-start justify-between gap-4">
          
          <div className="flex-1 min-w-0">
            {/* Shop Name - Giữ truncate vì tên quá dài sẽ đẩy layout, nhưng địa chỉ thì không */}
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <MapPin size={18} className="text-emerald-400 shrink-0 animate-breathe-slow" />
              <span className="truncate uppercase tracking-tight text-sm md:text-base">
                {shopName}
              </span>
            </div>

            {/* Address - ĐÃ FIX: Không ngắt quãng, cho phép xuống dòng thoải mái */}
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed italic break-words">
              {address}
            </p>
          </div>

          {/* Icon chỉ đường nhanh */}
          <div className="shrink-0 mt-1">
            <div className="p-2.5 rounded-full bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform group-hover:scale-110 active:scale-95">
              <Navigation size={16} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






//export default 
function MapPreview__ok({
  lat,
  lng,
  shopName,
  address,
}: Props) {

  const router = useRouter();

  const handleNavigation = () => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      name: shopName,
      address: address
    });
    router.push(`/map?${params.toString()}`);
  };
  
  return (
    <div
      onClick={handleNavigation}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10"
    >
      {/* Info Section */}
      <div className="bg-gradient-to-t from-black/80 p-4">
        <div className="flex items-center gap-2 font-semibold text-white">
          <MapPin size={16} className="text-emerald-400 shrink-0" />
          <span className="truncate">{shopName}</span>
        </div>
        <p className="truncate text-xs italic text-gray-300">{address}</p>
      </div>
  
      {/* CTA Button */}
      <div className="flex justify-center pb-4 transition group-hover:scale-105">
        <div className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-black shadow-lg">
          Xem bản đồ
        </div>
      </div>
    </div>
  );
}






//export default
function MapPreview_({
  lat,
  lng,
  shopName,
  address,
}: Props) {
  const router = useRouter();
  return (
    <div
      onClick={() =>
        router.push(
          `/map?lat=${lat}&lng=${lng}&name=${encodeURIComponent(
            shopName
          )}&address=${encodeURIComponent(address)}`
        )
      }
      className="cursor-pointer rounded-2xl overflow-hidden border border-white/10 group"
    >

      {/* Info overlay */}
      <div className="p-4 bg-gradient-to-t from-black/80">
        <div className="flex items-center gap-2 text-white font-semibold truncate">
          <MapPin size={16} className="text-emerald-400" />
          <span className="truncate">{shopName}</span>
        </div>
        <p className="text-xs text-gray-300 truncate italic">
          {address}
        </p>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-center opacity-1 group-hover:opacity-100 transition">
        <div className="px-4 py-2 bg-emerald-500 text-black rounded-full font-bold shadow-lg">
          Xem bản đồ
        </div>
      </div>
    </div>
  );
}