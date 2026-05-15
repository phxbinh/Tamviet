'use client';

import { useRouter } from 'next/navigation';

export function CategoryCTA({
  category,
  page,
  message,
  label,
}: {
  category: string;
  page: number;
  message: string;
  label: string;
}) {
  const router = useRouter();

  const handleClick = async () => {

//src/app/api/productchatbot/bot-sell/openRoute/resolve-category


    const res = await fetch(
      `/api/productchatbot/bot-sell/openRoute/resolve-category?name=${encodeURIComponent(
        category
      )}`
    );

    const data = await res.json();

    if (!data?.slug) return;

/*
    const params = new URLSearchParams({
      page: String(page),
      type: data.slug,
    });
*/

  const params = new URLSearchParams({
      page: String(page),
      type: data.code,
    });

    router.push(`/testSearchParam?${params}`);
  };

  return (
<>
<p>{message}</p>
    <button
      onClick={handleClick}
      className="px-4 py-3 rounded-2xl bg-blue-600 text-white font-semibold"
    >
      {label}
    </button>
</>
  );
}