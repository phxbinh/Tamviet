
'use client'
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ProductCardSlug } from "@/components/shop/ProductCard";
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';
import { ChevronLeft, ChevronRight } from "lucide-react"; // Bạn có thể dùng icon bất kỳ

interface Product {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  price_min: number;
}

interface RelatedProductsProps {
  relatedProducts: Product[];
}

//export default
function RelatedProductsSection_({ relatedProducts }: RelatedProductsProps) {
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (carousel.current) {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [relatedProducts]);

  return (
    <section className="mt-16 border-t pt-10 overflow-hidden">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold">Sản phẩm tương tự</h2>
          <p className="text-sm text-gray-500">Vuốt sang trái để xem thêm</p>
        </div>
        <div className="hidden md:flex gap-2 mb-2">
            <div className="w-8 h-1 bg-black rounded-full" />
            <div className="w-2 h-1 bg-gray-300 rounded-full" />
            <div className="w-2 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>

      <motion.div 
        ref={carousel} 
        // 1. Thêm touch-none ở container ngoài cùng để tránh trình duyệt can thiệp bậy
        className="cursor-grab active:cursor-grabbing relative touch-none"
        whileTap={{ cursor: "grabbing" }}
      >
        <motion.div
          drag="x"
          // 2. dragDirectionLock giúp cố định hướng gạt khi đã bắt đầu di chuyển
          dragDirectionLock 
          dragConstraints={{ right: 0, left: -width }}
          // 3. touch-pan-y: Đây là "vị cứu tinh". 
          // Cho phép cuộn trang dọc khi chạm vào đây, nhưng chặn cuộn trang khi gạt ngang.
          className="flex gap-6 touch-pan-y" 
        >
          {relatedProducts.map((item) => (
            <motion.div 
              key={item.id} 
              // 4. select-none ngăn việc bôi đen text khi đang kéo
              className="min-w-[250px] md:min-w-[300px] select-none"
            >
              <ProductCardSlug
                id={item.id}
                slug={item.slug}
                name={item.name}
                thumbnail_url={
                  item.thumbnail_url ? getPublicImageUrl(item.thumbnail_url) : undefined
                }
                price_min={item.price_min}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Lớp phủ mờ ở cạnh phải */}
        <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </motion.div>
    </section>
  );
}


// ... Interface Product giữ nguyên

//export default
function RelatedProductsSection__({ relatedProducts }: RelatedProductsProps) {
  const [width, setWidth] = useState(0);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  
  const carousel = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    const calculateWidth = () => {
      if (carousel.current) {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
      }
    };
    
    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, [relatedProducts]);

  const handleScroll = () => {
    const currentX = x.get();
    setShowLeftGradient(currentX < -20);
    setShowRightGradient(Math.abs(currentX) < width - 20);
  };

  // Hàm xử lý khi bấm nút Next/Prev
  const scrollBy = (direction: 'left' | 'right') => {
    const currentX = x.get();
    const step = 320; // Khoảng cách di chuyển mỗi lần bấm (1 card + gap)
    let targetX = direction === 'left' ? currentX + step : currentX - step;

    // Giới hạn không cho kéo quá biên
    targetX = Math.max(Math.min(targetX, 0), -width);

    animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      onUpdate: handleScroll
    });
  };

  return (
    <section className="mt-16 border-t pt-10 overflow-hidden">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Sản phẩm tương tự</h2>
          <p className="text-sm text-gray-400 mt-1">Khám phá thêm các lựa chọn phù hợp</p>
        </div>
        
        {/* Nút điều hướng cho Desktop */}
        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => scrollBy('left')}
            className={`p-2 rounded-full border transition-all ${showLeftGradient ? 'opacity-100 hover:bg-black hover:text-white' : 'opacity-30 cursor-not-allowed'}`}
            disabled={!showLeftGradient}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scrollBy('right')}
            className={`p-2 rounded-full border transition-all ${showRightGradient ? 'opacity-100 hover:bg-black hover:text-white' : 'opacity-30 cursor-not-allowed'}`}
            disabled={!showRightGradient}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative group">
        {/* Gradient mờ ảo */}
        <motion.div 
          animate={{ opacity: showLeftGradient ? 1 : 0 }}
          className="absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-white via-white/40 to-transparent z-10 pointer-events-none" 
        />

        <motion.div ref={carousel} className="cursor-grab active:cursor-grabbing">
          <motion.div
            drag="x"
            style={{ x }}
            dragConstraints={{ right: 0, left: -width }}
            dragDirectionLock
            onUpdate={handleScroll}
            className="flex gap-6 touch-pan-y"
          >
            {relatedProducts.map((item) => (
              <motion.div 
                key={item.id} 
                className="min-w-[260px] md:min-w-[320px] select-none"
              >
                <ProductCardSlug
                  id={item.id}
                  slug={item.slug}
                  name={item.name}
                  thumbnail_url={item.thumbnail_url ? getPublicImageUrl(item.thumbnail_url) : undefined}
                  price_min={item.price_min}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          animate={{ opacity: showRightGradient ? 1 : 0 }}
          className="absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-white via-white/40 to-transparent z-10 pointer-events-none" 
        />
      </div>
    </section>
  );
}





export default function RelatedProductsSection({ relatedProducts }: RelatedProductsProps) {
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // TỐI ƯU: Biến đổi tọa độ X thành độ mờ (opacity) trực tiếp, không dùng State
  // Khi x = 0 (đầu danh sách) -> opacity gradient trái = 0
  // Khi x = -20 -> bắt đầu hiện gradient trái
  const leftOpacity = useTransform(x, [0, -40], [0, 1]);

  // Khi x = -width (cuối danh sách) -> opacity gradient phải = 0
  // Chúng ta dùng hàm để tính toán động khi width thay đổi
  const rightOpacity = useTransform(x, [-width + 40, -width], [1, 0]);

  useEffect(() => {
    const calculateWidth = () => {
      if (carousel.current) {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
      }
    };
    calculateWidth();
    // Đợi ảnh load xong tính lại lần nữa cho chuẩn
    window.addEventListener('load', calculateWidth);
    window.addEventListener('resize', calculateWidth);
    return () => {
      window.removeEventListener('load', calculateWidth);
      window.removeEventListener('resize', calculateWidth);
    };
  }, [relatedProducts]);

  const scrollBy = (direction: 'left' | 'right') => {
    const step = 300;
    const targetX = direction === 'left' ? x.get() + step : x.get() - step;
    animate(x, Math.max(Math.min(targetX, 0), -width), {
      type: "spring",
      stiffness: 400, // Tăng độ cứng để phản hồi nhanh hơn
      damping: 40,
    });
  };

  return (
    <section className="mt-16 border-t pt-10 overflow-hidden select-none">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold uppercase">Sản phẩm tương tự</h2>
        <div className="hidden md:flex gap-2">
          <button onClick={() => scrollBy('left')} className="p-2 rounded-full border hover:bg-gray-100 active:scale-95 transition-transform"><ChevronLeft size={20}/></button>
          <button onClick={() => scrollBy('right')} className="p-2 rounded-full border hover:bg-gray-100 active:scale-95 transition-transform"><ChevronRight size={20}/></button>
        </div>
      </div>

      <div className="relative">
        {/* Gradient TRÁI - Không re-render React khi ẩn/hiện */}
        <motion.div 
          style={{ opacity: leftOpacity }}
          className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" 
        />

        <motion.div ref={carousel} className="touch-pan-y overflow-visible">
          <motion.div
            drag="x"
            style={{ x }}
            dragConstraints={{ right: 0, left: -width }}
            dragElastic={0.1} // Tạo độ bám tay (lò xo)
            dragTransition={{ power: 0.2, timeConstant: 200 }} // Giảm quán tính để dừng nhanh hơn, bớt cảm giác trôi
            className="flex gap-6 cursor-grab active:cursor-grabbing"
          >
            {relatedProducts.map((item) => (
              <div key={item.id} className="min-w-[250px] md:min-w-[300px] pointer-events-none md:pointer-events-auto">
                <ProductCardSlug {...item} />
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Gradient PHẢI - Không re-render React khi ẩn/hiện */}
        <motion.div 
          style={{ opacity: rightOpacity }}
          className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" 
        />
      </div>
    </section>
  );
}




