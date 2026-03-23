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

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        router.prefetch(href);
        observer.disconnect();
      }
    }, { rootMargin: '150px' });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [href]);

  return (
    <Link
      ref={ref}
      href={href}
      prefetch={false}
      onMouseEnter={() => router.prefetch(href)} // 🔥 hover boost
      onTouchStart={() => router.prefetch(href)} // 🔥 mobile
      className={className}
    >
      {children}
    </Link>
  );
}