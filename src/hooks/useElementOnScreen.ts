import { useEffect, useRef, useState, RefObject } from 'react';

export function useElementOnScreen(
  options: IntersectionObserverInit = { threshold: 0.1 }
): [RefObject<HTMLDivElement | null>, boolean] {
  // Khởi tạo ref với kiểu HTMLDivElement hoặc null
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(target);

    // Cleanup: Ngừng quan sát khi component bị hủy (unmount)
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [options]);

  return [containerRef, isVisible];
}
