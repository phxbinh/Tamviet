'use client'
import { useRouter } from 'next/navigation';
import { MapPin, Navigation } from 'lucide-react';

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
  
      {/* Bottom Action */}
      <div className="flex justify-center pb-4 pt-1">
        <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 transition-all group-hover:bg-emerald-500 group-hover:text-black">
          Mở bản đồ chi tiết
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