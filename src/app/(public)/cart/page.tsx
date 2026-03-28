import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';

export const CartComponent = () => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-card border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full">
        
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary animate-breathe-slow" />
            <h2 className="font-semibold text-lg uppercase tracking-wider">Giỏ hàng</h2>
          </div>
          <button className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Danh sách sản phẩm (Custom Scrollbar) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
          {[1, 2].map((item) => (
            <div key={item} className="flex gap-4 group">
              <div className="relative w-24 h-24 bg-foreground/5 rounded-xl overflow-hidden border border-border">
                <img 
                  src="https://defkqhylqphoqiikvbii.supabase.co/storage/v1/object/public/products/cafe.webp" 
                  alt="Sản phẩm"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                  fetchpriority="high"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-medium text-sm line-clamp-1">Cà phê Arabica Cầu Đất</h3>
                  <p className="text-xs text-foreground/60 mt-1">250g | Rang vừa</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-border rounded-lg bg-background">
                    <button className="p-1.5 hover:text-primary"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="px-3 text-sm font-medium">1</span>
                    <button className="p-1.5 hover:text-primary"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <span className="font-semibold text-sm text-neon-cyan">250.000đ</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-background/50 backdrop-blur-md">
          <div className="flex justify-between mb-4">
            <span className="text-foreground/60">Tổng cộng</span>
            <span className="font-bold text-xl text-primary">500.000đ</span>
          </div>
          <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all active:scale-95">
            Thanh toán ngay
          </button>
          <p className="text-[10px] text-center mt-4 text-foreground/40 uppercase tracking-tighter">
            Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ
          </p>
        </div>
      </div>
    </div>
  );
};
