
// src/components/sidebar/SidebarClient.tsx
/*
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SidebarLink } from './links';

function AnimatedSubmenu({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isOpen) {
      el.style.height = `${el.scrollHeight}px`;
      const t = setTimeout(() => { el.style.height = 'auto'; }, 300);
      return () => clearTimeout(t);
    } else {
      el.style.height = `${el.scrollHeight}px`;
      requestAnimationFrame(() => { el.style.height = '0px'; });
    }
  }, [isOpen]);

  return (
    <div ref={ref} className="overflow-hidden transition-all duration-300 ease-in-out" style={{ height: 0 }}>
      {children}
    </div>
  );
}

export default function SidebarClient({ links, onNavigate }: { links: SidebarLink[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const [openByLevel, setOpenByLevel] = useState<Record<number, string | null>>({});

  const isActive = (href?: string) => href && (pathname === href || pathname.startsWith(`${href}/`));

  const renderLink = (link: SidebarLink, depth = 0): React.ReactNode => {
    const hasChildren = !!link.children?.length;
    const active = isActive(link.href);
    const isOpen = openByLevel[depth] === link.name;
    const pl = 16 + depth * 12;

    const baseClass = "group relative flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 mb-1";
    const activeClass = "bg-neon-cyan/10 text-neon-cyan shadow-[inset_0_0_10px_rgba(34,211,238,0.1)] before:absolute before:left-0 before:top-1/4 before:h-1/2 before:w-1 before:rounded-full before:bg-neon-cyan";
    const inactiveClass = "text-muted-foreground hover:bg-white/5 hover:text-foreground";

    if (hasChildren) {
      return (
        <div key={`${depth}-${link.name}`} className="w-full">
          <button
            type="button"
            onClick={() => setOpenByLevel(p => ({ ...p, [depth]: p[depth] === link.name ? null : link.name }))}
            className={`${baseClass} ${isOpen ? 'text-foreground' : inactiveClass}`}
            style={{ paddingLeft: `${pl}px` }}
          >
            <span>{link.name}</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'opacity-40'}`} />
          </button>
          <AnimatedSubmenu isOpen={isOpen}>
            <div className="mt-1 border-l border-border/40 ml-6">
              {link.children!.map((child) => renderLink(child, depth + 1))}
            </div>
          </AnimatedSubmenu>
        </div>
      );
    }

    return (
      <Link
        key={link.href}
        prefetch={false}
        href={link.href!}
        onClick={onNavigate}
        className={`${baseClass} ${active ? activeClass : inactiveClass}`}
        style={{ paddingLeft: `${pl}px` }}
      >
        <span>{link.name}</span>
      </Link>
    );
  };

  return <nav className="px-3">{links.map((link) => renderLink(link, 0))}</nav>;
}
*/


'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import type { SidebarLink } from './links';

// --- 1. Component PrefetchLink Tối Ưu ---
interface PrefetchLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  href: string;
  children: React.ReactNode;
}

function PrefetchLink({
  href,
  children,
  className,
  onClick,
  ...props
}: PrefetchLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Chỉ prefetch nếu là link nội bộ (bắt đầu bằng /)
    if (!ref.current || typeof href !== 'string' || !href.startsWith('/')) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          router.prefetch(href);
          observer.disconnect();
        }
      },
      { rootMargin: '150px' }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [href, router]);

  return (
    <Link
      {...props}
      ref={ref}
      href={href}
      prefetch={false} // Tắt mặc định của Next.js để dùng logic custom
      className={className}
      onClick={onClick}
      onMouseEnter={(e) => {
        router.prefetch(href);
        props.onMouseEnter?.(e);
      }}
      onTouchStart={(e) => {
        router.prefetch(href);
        props.onTouchStart?.(e);
      }}
    >
      {children}
    </Link>
  );
}

// --- 2. Component Submenu với Animation ---
function AnimatedSubmenu({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isOpen) {
      el.style.height = `${el.scrollHeight}px`;
      const t = setTimeout(() => {
        el.style.height = 'auto';
      }, 300);
      return () => clearTimeout(t);
    } else {
      el.style.height = `${el.scrollHeight}px`;
      // Flush reflow để trình duyệt nhận diện chiều cao hiện tại trước khi về 0
      el.offsetHeight; 
      el.style.height = '0px';
    }
  }, [isOpen]);

  return (
    <div
      ref={ref}
      className="overflow-hidden transition-[height] duration-300 ease-in-out"
      style={{ height: 0 }}
    >
      {children}
    </div>
  );
}

// --- 3. Component Chính SidebarClient ---
export default function SidebarClient({ 
  links, 
  onNavigate 
}: { 
  links: SidebarLink[]; 
  onNavigate?: () => void 
}) {
  const pathname = usePathname();
  const [openByLevel, setOpenByLevel] = useState<Record<number, string | null>>({});

  const isActive = (href?: string) => 
    href && (pathname === href || pathname.startsWith(`${href}/`));

  const renderLink = (link: SidebarLink, depth = 0): React.ReactNode => {
    const hasChildren = !!link.children?.length;
    const active = isActive(link.href);
    const isOpen = openByLevel[depth] === link.name;
    const pl = 16 + depth * 12;

    const baseClass = 
      "group relative flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 mb-1";
    const activeClass = 
      "bg-neon-cyan/10 text-neon-cyan shadow-[inset_0_0_10px_rgba(34,211,238,0.1)] before:absolute before:left-0 before:top-1/4 before:h-1/2 before:w-1 before:rounded-full before:bg-neon-cyan";
    const inactiveClass = 
      "text-muted-foreground hover:bg-white/5 hover:text-foreground";

    if (hasChildren) {
      return (
        <div key={`${depth}-${link.name}`} className="w-full">
          <button
            type="button"
            onClick={() => 
              setOpenByLevel(p => ({ 
                ...p, 
                [depth]: p[depth] === link.name ? null : link.name 
              }))
            }
            className={`${baseClass} ${isOpen ? 'text-foreground' : inactiveClass}`}
            style={{ paddingLeft: `${pl}px` }}
          >
            <span>{link.name}</span>
            <ChevronDown 
              size={14} 
              className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'opacity-40'}`} 
            />
          </button>
          <AnimatedSubmenu isOpen={isOpen}>
            <div className="mt-1 border-l border-white/10 ml-6">
              {link.children!.map((child) => renderLink(child, depth + 1))}
            </div>
          </AnimatedSubmenu>
        </div>
      );
    }

    return (
      <PrefetchLink
        key={link.href}
        href={link.href!}
        onClick={onNavigate}
        className={`${baseClass} ${active ? activeClass : inactiveClass}`}
        style={{ paddingLeft: `${pl}px` }}
      >
        <span>{link.name}</span>
      </PrefetchLink>
    );
  };

  return (
    <nav className="px-3 flex flex-col w-full">
      {links.map((link) => renderLink(link, 0))}
    </nav>
  );
}














