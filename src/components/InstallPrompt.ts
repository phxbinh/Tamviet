'use client';

import { useEffect, useState } from 'react';
import { Share, PlusSquare, X, Smartphone } from 'lucide-react';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra có phải thiết bị iOS (iPhone/iPad) không
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // 2. Kiểm tra xem web đã chạy ở chế độ "Standalone" (đã cài đặt) chưa
    // @ts-ignore - navigator.standalone chỉ có trên iOS Safari
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    // 3. Kiểm tra xem người dùng đã tắt thông báo này trong phiên làm việc này chưa
    const isDismissed = sessionStorage.getItem('pwa_prompt_dismissed');

    if (isIOS && !isStandalone && !isDismissed) {
      // Delay một chút sau khi load trang để tạo cảm giác tự nhiên
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Overlay mờ nhẹ phía sau để làm nổi bật Prompt */}
      <div className="fixed inset-0 bg-black/5 z-[99] pointer-events-none" />

      <div className="fixed bottom-8 left-4 right-4 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-700 ease-out">
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-6">
          
          {/* Nút đóng */}
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4 text-foreground/40" />
          </button>

          <div className="flex flex-col gap-6">
            {/* Header: Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-black rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-black/20">
                <span className="text-white font-black text-xl tracking-tighter">TV</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-base text-foreground">Tâm Việt Luxury</h4>
                <p className="text-[11px] text-foreground/50 font-medium uppercase tracking-wider">
                  Trải nghiệm mượt mà như App Store
                </p>
              </div>
            </div>

            {/* Steps: Hướng dẫn chi tiết */}
            <div className="grid grid-cols-1 gap-3 py-4 border-y border-foreground/5">
              <div className="flex items-center gap-4 group">
                <div className="flex-none w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Share className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground/80">
                  Nhấn vào biểu tượng <span className="font-bold text-foreground underline decoration-primary/30">Chia sẻ</span> ở thanh công cụ dưới cùng
                </p>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="flex-none w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <PlusSquare className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground/80">
                  Kéo xuống dưới và chọn <span className="font-bold text-foreground underline decoration-primary/30">"Thêm vào MH chính"</span>
                </p>
              </div>
            </div>

            {/* Footer Tip */}
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
              <Smartphone className="w-3 h-3" />
              <span>Chỉ mất 5 giây để nâng tầm trải nghiệm</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
