// useScrollDirection.ts
"use client";

import { useEffect, useState } from "react";

export function useScrollDirection(container?: HTMLElement | null) {
  const [direction, setDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    if (!container) return;

    let lastScroll = container.scrollTop;

    const handleScroll = () => {
      const current = container.scrollTop;

      if (current > lastScroll) {
        setDirection("down");
      } else {
        setDirection("up");
      }

      lastScroll = current;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [container]);

  return direction;
}