


// Chỉ dùng cho tham khảo.
'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function PrefetchLink({
  href,
  children,
  className
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          router.prefetch(href);
          observer.disconnect(); // 🔥 chỉ prefetch 1 lần
        }
      },
      { rootMargin: '100px' } // 👈 prefetch sớm hơn 1 chút
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [href]);

  return (
    <Link
      ref={ref}
      href={href}
      prefetch={false} // 🔥 tắt default
      className={className}
    >
      {children}
    </Link>
  );
}