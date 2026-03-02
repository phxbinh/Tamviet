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

  return <div ref={ref} className="overflow-hidden transition-all duration-300" style={{ height: 0 }}>{children}</div>;
}

export default function SidebarClient({ links, onNavigate }: { links: SidebarLink[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const [openByLevel, setOpenByLevel] = useState<Record<number, string | null>>({});

  const renderLink = (link: SidebarLink, depth = 0): React.ReactNode => {
    const hasChildren = !!link.children?.length;
    const active = link.href && (pathname === link.href || pathname.startsWith(`${link.href}/`));
    const isOpen = openByLevel[depth] === link.name;
    const pl = 16 + depth * 12;

    const baseClass = "group flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all mb-1";
    const activeClass = "bg-neon-cyan/10 text-neon-cyan shadow-[inset_0_0_10px_rgba(34,211,238,0.1)] before:absolute before:left-0 before:h-5 before:w-1 before:bg-neon-cyan before:rounded-r";

    if (hasChildren) {
      return (
        <div key={link.name} className="w-full">
          <button
            onClick={() => setOpenByLevel(p => ({ ...p, [depth]: p[depth] === link.name ? null : link.name }))}
            className={`${baseClass} ${isOpen ? 'text-foreground bg-accent/30' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
            style={{ paddingLeft: `${pl}px` }}
          >
            <span>{link.name}</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'opacity-40'}`} />
          </button>
          <AnimatedSubmenu isOpen={isOpen}>
            <div className="mt-1 border-l border-border/40 ml-6">{link.children!.map((child) => renderLink(child, depth + 1))}</div>
          </AnimatedSubmenu>
        </div>
      );
    }

    return (
      <Link
        key={link.href}
        href={link.href!}
        onClick={onNavigate}
        className={`${baseClass} ${active ? activeClass : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
        style={{ paddingLeft: `${pl}px` }}
      >
        {link.name}
      </Link>
    );
  };

  return <nav className="px-3">{links.map((link) => renderLink(link, 0))}</nav>;
}
