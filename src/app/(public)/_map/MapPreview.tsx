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
      className="relative cursor-pointer rounded-2xl overflow-hidden border border-white/10 group"
    >

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-2 text-white font-semibold truncate">
          <MapPin size={16} className="text-emerald-400" />
          <span className="truncate">{shopName}</span>
        </div>
        <p className="text-xs text-gray-300 truncate italic">
          {address}
        </p>
      </div>

      {/* CTA */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <div className="px-4 py-2 bg-emerald-500 text-black rounded-full font-bold shadow-lg">
          Xem bản đồ
        </div>
      </div>
    </div>
  );
}