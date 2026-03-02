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

  const toggleMenu = (name: string, depth: number) => {
    setOpenByLevel((prev) => ({ ...prev, [depth]: prev[depth] === name ? null : name }));
  };

  const isActive = (href?: string) => href && (pathname === href || pathname.startsWith(`${href}/`));

  const renderLink = (link: SidebarLink, depth = 0): React.ReactNode => {
    const hasChildren = !!link.children?.length;
    const active = isActive(link.href);
    const isOpen = openByLevel[depth] === link.name;
    const pl = 12 + depth * 16;

    const baseClass = "group relative flex w-full items-center justify-between rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 mb-0.5";
    const activeClass = "bg-neon-cyan/10 text-neon-cyan shadow-[inset_0_0_10px_rgba(34,211,238,0.1)] before:absolute before:left-0 before:top-1/4 before:h-1/2 before:w-1 before:rounded-full before:bg-neon-cyan before:shadow-[0_0_10px_#22d3ee]";
    const inactiveClass = "text-muted-foreground hover:bg-accent hover:text-foreground";

    if (hasChildren) {
      return (
        <div key={`${depth}-${link.name}`} className="w-full">
          <button
            type="button"
            onClick={() => toggleMenu(link.name, depth)}
            className={`${baseClass} ${isOpen ? 'text-foreground bg-accent/30' : inactiveClass}`}
            style={{ paddingLeft: `${pl}px` }}
          >
            <span>{link.name}</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'opacity-40'}`} />
          </button>
          <AnimatedSubmenu isOpen={isOpen}>
            <div className="mt-0.5 border-l border-border/50 ml-6 mb-2">
              {link.children!.map((child) => renderLink(child, depth + 1))}
            </div>
          </AnimatedSubmenu>
        </div>
      );
    }

    return (
      <Link
        key={link.href}
        href={link.href!}
        onClick={onNavigate}
        className={`${baseClass} ${active ? activeClass : inactiveClass}`}
        style={{ paddingLeft: `${pl}px` }}
      >
        <span>{link.name}</span>
      </Link>
    );
  };

  return <nav className="px-2">{links.map((link) => renderLink(link, 0))}</nav>;
}
