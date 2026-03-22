"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollDirection } from "./useScrollDirection";

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
          transition: "transform 640ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
        className="bg-background/80 backdrop-blur-md border-b border-border"
      >
        {children}
      </div>
    </div>
  );
}






