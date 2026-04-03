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
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 hover:border-emerald-500/30"
    >
      {/* Info Section - Sử dụng Gradient khớp với style tối của bạn */}
      <div className="bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 font-semibold text-white">
              {/* Sử dụng animation breathe-slow từ globals.css */}
              <MapPin size={18} className="text-emerald-400 shrink-0 animate-breathe-slow" />
              <span className="truncate uppercase tracking-tight">{shopName}</span>
            </div>
            <p className="mt-1 truncate text-xs italic text-gray-400">
              {address}
            </p>
          </div>

          {/* Nút tròn nhỏ bên phải giống số 2 nhưng gọn hơn */}
          <div className="flex shrink-0 items-center justify-center p-2 rounded-full bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform group-hover:scale-110">
            <Navigation size={14} fill="currentColor" />
          </div>
        </div>
      </div>
  
      {/* CTA Button Section */}
      <div className="flex justify-center pb-4 pt-2">
        <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 transition-all group-hover:bg-emerald-500 group-hover:text-black">
          Xem bản đồ
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