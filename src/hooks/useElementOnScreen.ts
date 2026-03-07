import { useEffect, useRef, useState, RefObject } from 'react';

// 1. Định nghĩa Interface mở rộng để TS hiểu 'freezeOnceVisible'
interface UseElementOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useElementOnScreen(
  options: UseElementOptions = { threshold: 0.1 }
): [RefObject<HTMLDivElement | null>, boolean] {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        
        // 2. Nếu có cờ freezeOnceVisible, ta ngắt kết nối luôn sau khi thấy
        if (options.freezeOnceVisible) {
          observer.unobserve(target);
        }
      } else {
        // Nếu không freeze thì mới set về false khi ra ngoài màn hình
        if (!options.freezeOnceVisible) {
          setIsVisible(false);
        }
      }
    }, options);

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [options]); // Effect sẽ chạy lại nếu options thay đổi

  return [containerRef, isVisible];
}
