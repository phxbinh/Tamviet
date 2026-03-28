// components/skeletons/HomeSkeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div className="border border-[hsl(var(--border))] rounded-xl p-0 bg-[hsl(var(--card))] animate-pulse overflow-hidden flex flex-col h-full">
      {/* Giả lập Ảnh sản phẩm - Cực kỳ quan trọng để fix CLS */}
      <div className="aspect-square bg-muted/50 w-full" />
      
      {/* Giả lập Nội dung text bên dưới */}
      <div className="p-3 space-y-2">
        <div className="h-3 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted/80 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="mb-2 mt-2 border border-[hsl(var(--border))] rounded-lg p-1 bg-[hsl(var(--card))]">
      <section className="mt-1 w-full overflow-hidden">
        {/* Header Skeleton */}
        <div className="flex justify-between items-end mb-4 px-4">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            <div className="h-1 w-12 bg-muted rounded" />
          </div>
          <div className="hidden md:flex gap-2">
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
          </div>
        </div>

        {/* Swiper Skeleton giả lập slidesPerView={2.1} */}
        <div className="flex gap-[10px] px-0 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="min-w-[45%] md:min-w-[30%] lg:min-w-[23%] h-auto shrink-0"
            >
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
