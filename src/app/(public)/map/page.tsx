'use client';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const StoreMap = dynamic(() => import('../_map/StoreMap'), {
  ssr: false,
});

export default function MapsPage() {
  const params = useSearchParams();

  const lat = Number(params.get('lat'));
  const lng = Number(params.get('lng'));
  const shopName = params.get('name') || '';
  const address = params.get('address') || '';

  return (
    <div className="w-full h-screen">
      <StoreMap
        lat={lat}
        lng={lng}
        shopName={decodeURIComponent(shopName)}
        address={decodeURIComponent(address)}
      />
    </div>
  );
}