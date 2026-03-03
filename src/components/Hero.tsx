// components/Hero.tsx
import { ThemeToggle } from "./ThemeToggle";

export const Hero = () => {
  return (
    <section className="min-h-[720px] flex flex-col items-center justify-center px-4 transition-colors duration-300">

      <div className="max-w-4xl text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Xây dựng tương lai với <span className="text-primary">Next.js & TS</span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Hệ thống Theme của bạn đã sẵn sàng. Thử nhấn vào nút góc phải màn hình để cảm nhận sự thay đổi mượt mà giữa các chế độ.
        </p>

        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:opacity-90 transition-all">
            Bắt đầu ngay
          </button>
          <button className="px-8 py-3 bg-card text-foreground border border-border rounded-full font-medium hover:bg-gray-100 dark:hover:bg-slate-800 transition-all">
            Tài liệu
          </button>
        </div>
      </div>
    </section>
  );
};
