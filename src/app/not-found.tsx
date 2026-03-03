// src/app/not-found.tsx
import Link from "next/link";
import { MoveLeft, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      {/* Hiệu ứng số 404 phát sáng */}
      <div className="relative">
        <h1 className="text-9xl font-black tracking-tighter opacity-10 select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <Terminal size={64} className="text-neon-cyan animate-pulse" />
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Lỗi hệ thống: <span className="text-neon-cyan">PATH_NOT_FOUND</span>
        </h2>
        <p className="text-muted-foreground max-w-[400px] text-sm leading-relaxed">
          Tài nguyên bạn đang tìm kiếm đã bị di chuyển, xóa hoặc chưa từng tồn tại trong hệ điều hành này.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="group flex items-center gap-2 px-6 py-3 bg-neon-cyan text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300"
        >
          <MoveLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          QUAY LẠI HỆ THỐNG
        </Link>
        
        <Link
          href="/support"
          className="px-6 py-3 border border-border hover:bg-accent rounded-xl transition-colors font-medium text-sm"
        >
          BÁO CÁO SỰ CỐ
        </Link>
      </div>

      {/* Trang trí thêm cho hợp vibe Neon */}
      <div className="mt-16 grid grid-cols-3 gap-8 opacity-20 hidden md:flex">
        <div className="h-px w-24 bg-gradient-to-r from-transparent to-neon-cyan"></div>
        <div className="text-[10px] font-mono tracking-widest">STATUS: 404_ERROR</div>
        <div className="h-px w-24 bg-gradient-to-l from-transparent to-neon-cyan"></div>
      </div>
    </div>
  );
}




