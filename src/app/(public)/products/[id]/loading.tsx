export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-colors duration-500">
      {/* Container chính với hiệu ứng breathe-slow từ globals.css của bạn */}
      <div className="relative flex flex-col items-center animate-breathe-slow">
        
        {/* Vòng tròn loading */}
        <div className="relative h-24 w-24">
          {/* Vòng sáng phía sau (Glow) */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
          
          {/* Vòng quay chính - Dùng animate-spin có sẵn */}
          <div className="h-full w-full rounded-full border-t-2 border-r-2 border-primary animate-spin shadow-[0_0_15px_rgba(34,211,238,0.3)]"></div>
          
          {/* Vòng nhỏ bên trong quay ngược lại */}
          <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-neon-purple animate-[spin_1.5s_linear_infinite_reverse] opacity-70"></div>
        </div>

        {/* Phần Text */}
        <div className="mt-8 flex flex-col items-center space-y-3">
          <h2 className="text-xl font-medium tracking-[0.2em] text-foreground/80 uppercase">
            Cất cánh
          </h2>
          
          {/* Thanh progress dùng CSS Animation thuần thông qua thuộc tính style để tránh lỗi build */}
          <div className="h-[2px] w-32 overflow-hidden rounded-full bg-border">
            <div 
              className="h-full bg-primary" 
              style={{
                animation: 'loading-bar 2s infinite ease-in-out',
                transformOrigin: 'left'
              }}
            ></div>
          </div>
          
          <p className="text-[10px] text-foreground/40 font-light tracking-wider animate-pulse">
            Đang chuẩn bị không gian cho bạn...
          </p>
        </div>
      </div>

      {/* Định nghĩa Keyframe trực tiếp trong CSS chuẩn của Tailwind 4 hoặc ném vào globals.css */}
      <style>{`
        @keyframes loading-bar {
          0% { transform: scaleX(0); transform-origin: left; }
          45% { transform: scaleX(1); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
      `}</style>
    </div>
  );
}
