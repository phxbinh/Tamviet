"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollDirection } from "./useScrollDirection";

/*
export function StickyFilterWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  // 🔥 tìm scroll container thật (main)
  useEffect(() => {
  let el: HTMLElement | null = ref.current; // ✅ đổi type tại đây

  while (el) {
    if (el.scrollHeight > el.clientHeight) {
      setContainer(el);
      break;
    }
    el = el.parentElement;
  }
}, []);

  const direction = useScrollDirection(container);

  const isHidden = direction === "down";

  return (
    <div
      ref={ref}
      className={`
        sticky top-16 z-20
        transition-all duration-300 ease-out
        ${isHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}
      `}
    >
      <div className="bg-background/80 backdrop-blur-md border-b border-border">
        {children}
      </div>
    </div>
  );
}
*/


export function StickyFilterWrapper_({
  children,
}: {
  children: React.ReactNode;
}) {
  const direction = useScrollDirection();

  const isCompact = direction === "down";

  return (
<div
  className={`
    sticky top-16 z-20
    transition-transform duration-300 ease-out
    ${isCompact ? "-translate-y-2 scale-[0.98]" : "translate-y-0 scale-100"}
  `}
>
      <div
        className={`
          bg-background/80 backdrop-blur-md border-b border-border
          transition-all duration-300
          ${isCompact ? "scale-[0.98]" : "scale-100"}
        `}
      >
        {children}
      </div>
    </div>
  );
}

// Chạy ngon
export function StickyFilterWrapper__({
  children,
}: {
  children: React.ReactNode;
}) {
  const direction = useScrollDirection();

  const isCompact = direction === "down";

  return (
<div
  className={`
    sticky top-16 z-20
    transition-transform duration-300 ease-out
    ${isCompact ? "-translate-y-0 scale-[1.0]" : "translate-y-0 scale-100"}
  `}
>
      <div
        className={`
          bg-background/80 backdrop-blur-md border-b border-border
          transition-all duration-300
          ${isCompact ? "scale-[1.0]" : "scale-100"}
        `}
      >
        {children}
      </div>
    </div>
  );
}



export function StickyFilterWrapper__ux({
  children,
}: {
  children: React.ReactNode;
}) {
  const direction = useScrollDirection();

  const isHidden = direction === "down";

  return (
    <div
      className={`
        sticky top-16 z-20
        transition-transform duration-300 ease-out will-change-transform
        ${isHidden ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      <div className="bg-background/80 backdrop-blur-md border-b border-border">
        {children}
      </div>
    </div>
  );
}



export function StickyFilterWrapper__ux_({
  children,
}: {
  children: React.ReactNode;
}) {
  const direction = useScrollDirection();
  const isHidden = direction === "down";

  return (
    <div
      className={`
        sticky top-16 z-20
        will-change-transform
        transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isHidden 
          ? "-translate-y-full opacity-0 pointer-events-none" 
          : "translate-y-0 opacity-100"}
      `}
    >
      <div
        className={`
          bg-background/80 backdrop-blur-md border-b border-border
          transition-transform duration-300
          ${isHidden ? "scale-[0.98]" : "scale-100"}
        `}
      >
        {children}
      </div>
    </div>
  );
}


export function StickyFilterWrapper____({
  children,
}: {
  children: React.ReactNode;
}) {
  const direction = useScrollDirection();
  const isHidden = direction === "down";

  return (
    <div
      className={`
        sticky top-16 z-20
        will-change-transform
        transition-transform duration-300 ease-out
        ${isHidden ? "-translate-y-[80px]" : "translate-y-0"}
      `}
    >
      <div className="bg-background/80 backdrop-blur-md border-b border-border">
        {children}
      </div>
    </div>
  );
}






/*
"use client"
import { useEffect, useRef, useState } from "react";
import { useScrollDirection } from "./useScrollDirection";
*/
export function StickyFilterWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const direction = useScrollDirection();

  const ref = useRef<HTMLDivElement>(null);
  const heightRef = useRef(0);

  const [mounted, setMounted] = useState(false);

  // 👉 đo chiều cao 1 lần (không re-render liên tục)
  useEffect(() => {
    if (ref.current) {
      heightRef.current = ref.current.offsetHeight;
      setMounted(true);
    }
  }, []);

  const isHidden = direction === "down";

  return (
    <div className="sticky top-16 z-20 overflow-hidden">
      <div
        ref={ref}
        style={{
          transform: mounted
            ? isHidden
              ? `translate3d(0, -${heightRef.current}px, 0)`
              : "translate3d(0, 0, 0)"
            : "translate3d(0,0,0)",
          transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
        className="bg-background/80 backdrop-blur-md border-b border-border"
      >
        {children}
      </div>
    </div>
  );
}






