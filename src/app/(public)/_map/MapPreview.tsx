'use client'
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';

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