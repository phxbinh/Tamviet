'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function PrefetchLink({
  href,
  children,
  className,
  startTransition // 👈 nhận từ ngoài để sync isPending
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  startTransition?: (cb: () => void) => void;
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
      className={className}
      onMouseEnter={() => router.prefetch(href)}
      onTouchStart={() => router.prefetch(href)}
      onClick={(e) => {
        e.preventDefault();

        if (startTransition) {
          startTransition(() => {
            router.push(href);
          });
        } else {
          router.push(href);
        }
      }}
    >
      {children}
    </Link>
  );
}