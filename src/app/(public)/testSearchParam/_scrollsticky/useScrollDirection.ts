// useScrollDirection.ts
/*
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
*/

/*
"use client";

import { useEffect, useState } from "react";

export function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    const container = document.getElementById("scroll-container");
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
  }, []);

  return direction;
}
*/


/* Chạy được
 'use client'

import { useEffect, useState } from "react";

export function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      const current = window.scrollY;

      // chống rung
      if (Math.abs(current - lastScroll) < 5) return;

      if (current > lastScroll) {
        setDirection("down");
      } else {
        setDirection("up");
      }

      lastScroll = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return direction;
}
*/


'use client'

import { useEffect, useRef, useState } from "react";

export function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const lastScroll = useRef(0);

  useEffect(() => {
    lastScroll.current = window.scrollY;

    const handleScroll = () => {
      const current = window.scrollY;

      // 🔥 chặn cuối trang (fix giật)
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (current >= maxScroll - 2) return;

      // 🔥 chống rung nhẹ
      if (Math.abs(current - lastScroll.current) < 5) return;

      if (current > lastScroll.current) {
        if (direction !== "down") setDirection("down");
      } else {
        if (direction !== "up") setDirection("up");
      }

      lastScroll.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [direction]);

  return direction;
}

