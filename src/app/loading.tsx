export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-colors duration-500">
      {/* Container chính với hiệu ứng thở (breathe) từ globals.css */}
      <div className="relative flex flex-col items-center animate-breathe-slow">
        
        {/* Vòng tròn loading gradient neon */}
        <div className="relative h-24 w-24">
          {/* Vòng sáng phía sau (Glow) */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
          
          {/* Vòng quay chính */}
          <div className="h-full w-full rounded-full border-t-2 border-r-2 border-primary animate-spin shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
          
          {/* Vòng nhỏ bên trong quay ngược lại */}
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-neon-purple animate-[spin_1.5s_linear_infinite_reverse] opacity-70"></div>
        </div>

        {/* Phần Text thông báo */}
        <div className="mt-8 flex flex-col items-center space-y-2">
          <h2 className="text-xl font-medium tracking-widest text-foreground/80 uppercase">
            Cất cánh
          </h2>
          
          {/* Thanh progress giả lập cực mượt */}
          <div className="h-[2px] w-32 overflow-hidden rounded-full bg-border">
            <div className="h-full w-full origin-left bg-primary animate-[loading_2s_infinite_ease-in-out]"></div>
          </div>
          
          <p className="text-xs text-foreground/40 italic animate-pulse">
            Đang chuẩn bị không gian cho bạn...
          </p>
        </div>
      </div>

      {/* CSS Inline cho animation thanh progress (vì Tailwind 4 @theme chưa có keyframe này) */}
      <style jsx>{`
        @keyframes loading {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.5); transform-origin: left; }
          100% { transform: scaleX(1); transform-origin: right; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
