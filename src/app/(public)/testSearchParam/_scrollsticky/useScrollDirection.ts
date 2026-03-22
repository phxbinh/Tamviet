
'use client'

import { useEffect, useRef, useState } from "react";

export function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down">("up");

  const lastScroll = useRef(0);
  const accumulated = useRef(0);

  const THRESHOLD = 120;

  useEffect(() => {
    lastScroll.current = window.scrollY;

    const handleScroll = () => {
      const current = window.scrollY;

      const delta = current - lastScroll.current;

      if (Math.abs(delta) < 2) return;

      accumulated.current += delta;

      if (accumulated.current > THRESHOLD) {
        setDirection((prev) => (prev !== "down" ? "down" : prev));
        accumulated.current = 0;
      }

      if (accumulated.current < -THRESHOLD) {
        setDirection((prev) => (prev !== "up" ? "up" : prev));
        accumulated.current = 0;
      }

      lastScroll.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return direction;
}


