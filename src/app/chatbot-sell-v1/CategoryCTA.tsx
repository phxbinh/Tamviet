'use client';

import { useRouter } from 'next/navigation';

export function CategoryCTA({
  category,
  page,
  label,
}: {
  category: string;
  page: number;
  label: string;
}) {
  const router = useRouter();

  const handleClick = async () => {

    const res = await fetch(
      `/api/resolve-category?name=${encodeURIComponent(
        category
      )}`
    );

    const data = await res.json();

    if (!data?.slug) return;

    const params = new URLSearchParams({
      page: String(page),
      type: data.slug,
    });

    router.push(`/testSearchParam?${params}`);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-3 rounded-2xl bg-blue-600 text-white font-semibold"
    >
      {label}
    </button>
  );
}