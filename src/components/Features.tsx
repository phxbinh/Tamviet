// components/Features.tsx
const features = [
  { title: "Hiệu năng cực đỉnh", desc: "Tối ưu hóa hình ảnh và tốc độ tải trang tự động." },
  { title: "TypeScript Safe", desc: "Giảm thiểu lỗi runtime với kiểu dữ liệu chặt chẽ." },
  { title: "Dark Mode Native", desc: "Hỗ trợ Light/Dark và System OS ngay khi khởi tạo." },
];

export const Features = () => {
  return (
    <section className="py-20 bg-gray-50/50 dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div key={i} className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
              {i + 1}
            </div>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
