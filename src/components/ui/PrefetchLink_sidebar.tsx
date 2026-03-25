'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Sử dụng ComponentProps thay vì ComponentPropsWithoutRef để đồng bộ hơn
interface PrefetchLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
  children: React.ReactNode;
}

export function PrefetchLink({
  href,
  children,
  className,
  ...props 
}: PrefetchLinkProps) {
  // 1. Khai báo ref chuẩn cho thẻ anchor
  const ref = useRef<HTMLAnchorElement>(null);
  const router = useRouter();

  useEffect(() => {
    // 2. Kiểm tra href là string và bắt đầu bằng '/' (Internal link)
    if (!ref.current || typeof href !== 'string' || !href.startsWith('/')) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        router.prefetch(href);
        observer.disconnect();
      }
    }, { rootMargin: '150px' });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [href, router]);

  return (
    <Link
      {...props}       // 3. Spread props trước để các thuộc tính mặc định không đè lên logic prefetch
      ref={ref}
      href={href}
      prefetch={false}
      onMouseEnter={(e) => {
        router.prefetch(href);
        props.onMouseEnter?.(e); // Giữ lại logic onMouseEnter nếu có truyền từ ngoài vào
      }}
      onTouchStart={(e) => {
        router.prefetch(href);
        props.onTouchStart?.(e); // Giữ lại logic onTouchStart
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
