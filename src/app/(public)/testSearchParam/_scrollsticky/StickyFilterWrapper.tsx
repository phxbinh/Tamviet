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


export function StickyFilterWrapper({
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
        transition-all duration-300 ease-out
        ${isCompact ? "py-1" : "py-3"}
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


