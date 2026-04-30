// /chatbot-sell-v1/ProductCard.tsx
import { getPublicImageUrl } from '@/lib/supabase/publicUrl';

export function ProductCard({ product }: { product: any }) {
  return (
    <div className="min-w-[220px] max-w-[220px] group bg-card border border-border/60 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-500/40 transition-all duration-500">
      <div className="relative h-36 w-full bg-secondary/20 overflow-hidden">
        <img 
          src={getPublicImageUrl(product.image)} 
          alt={product.title} 
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[9px] text-white font-bold uppercase tracking-widest shadow-xl">
          IN STOCK
        </div>
      </div>
      <div className="p-5 space-y-3">
        <h4 className="font-bold text-[14px] line-clamp-2 h-10 leading-[1.3] tracking-tight opacity-90 group-hover:text-blue-500 transition-colors">
          {product.title}
        </h4>
        <div className="flex items-center justify-between pt-1">
          <span className="text-blue-600 dark:text-blue-400 font-black text-[15px]">
            {product.price}
          </span>
        </div>
        <a 
          href={product.url}
          target="_blank"
          className="mt-4 block w-full text-center py-3 bg-secondary/50 hover:bg-blue-600 hover:text-white rounded-[18px] text-[11px] font-black transition-all duration-300 uppercase tracking-widest shadow-sm"
        >
          Chi tiết
        </a>
      </div>
    </div>
  );
}
