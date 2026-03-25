"use client";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background text-foreground transition-colors duration-300">
      {/* Icon với hiệu ứng thở (breathe) từ globals.css */}
      <div className="w-24 h-24 bg-card border border-border rounded-full flex items-center justify-center mb-8 shadow-sm animate-breathe-slow">
        <span className="text-5xl">📡</span>
      </div>

      <div className="space-y-3 max-w-sm">
        <h1 className="text-3xl font-bold tracking-tight">
          Mất kết nối mạng
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Có vẻ bạn đang ở vùng sóng yếu. Đừng lo, các sản phẩm **Tâm Việt** bạn đã xem vẫn có thể truy cập được!
        </p>
      </div>

      <div className="mt-10 w-full max-w-xs space-y-4">
        <button 
          onClick={() => window.location.reload()}
          className="w-full px-8 py-4 bg-foreground text-background rounded-full font-semibold shadow-lg active:scale-95 transition-all duration-200"
        >
          Thử lại ngay
        </button>
        
        <p className="text-xs uppercase tracking-widest opacity-50 font-medium">
          Tâm Việt Luxury
        </p>
      </div>

      {/* Trang trí thêm một chút hiệu ứng Gradient mờ phía sau cho đúng chất Luxury */}
      <div className="fixed -z-10 top-0 left-0 w-full h-full opacity-20 pointer-events-none dark:opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/10 blur-[120px]" />
      </div>
    </div>
  );
}
