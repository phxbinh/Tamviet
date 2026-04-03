'use client'
import React from 'react';
import { ShieldCheck, Leaf, Zap } from 'lucide-react';
import ClientTracker from "../userInfo/ClientTracker";

const AboutComponent = () => {
  return (
    <ClientTracker />
    <section className="py-16 px-6 max-w-4xl mx-auto space-y-12">
      {/* Tiêu đề chính */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-light tracking-[0.2em] uppercase">
          Về <span className="font-bold text-neon-cyan">Tâm Việt</span>
        </h2>
        <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
        <p className="text-foreground/70 leading-relaxed max-w-xl mx-auto italic">
          "Nơi hội tụ những giá trị thuần khiết nhất từ bàn tay người thợ Việt, mang đến trải nghiệm thượng lưu trong từng sản phẩm."
        </p>
      </div>

      {/* Grid giá trị cốt lõi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Leaf className="w-6 h-6" />, title: "Thuần khiết", desc: "Nguyên liệu 100% tự nhiên được tuyển chọn khắt khe." },
          { icon: <ShieldCheck className="w-6 h-6" />, title: "Tâm huyết", desc: "Mỗi sản phẩm là một tác phẩm nghệ thuật thủ công." },
          { icon: <Zap className="w-6 h-6" />, title: "Đột phá", desc: "Ứng dụng công nghệ hiện đại trong sản xuất truyền thống." }
        ].map((feature, idx) => (
          <div 
            key={idx} 
            className="p-8 rounded-3xl bg-card border border-border/50 hover:border-neon-cyan/50 transition-all duration-500 group animate-breathe-slow"
            style={{ animationDelay: `${idx * 0.5}s` }}
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">{feature.title}</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Phần Render Markdown giả lập */}
      <div className="markdown-body bg-foreground/[0.02] p-8 rounded-3xl border border-border">
        <h3 className="text-xl font-semibold mb-4">Câu chuyện của chúng tôi</h3>
        <p>
          Khởi nguồn từ mong muốn nâng tầm nông sản Việt, **Tâm Việt** không chỉ bán sản phẩm, chúng tôi bán niềm tự hào dân tộc. 
          Mọi quy trình từ farm đến tay người tiêu dùng đều được tối ưu hóa...
        </p>
        <img 
          src="https://defkqhylqphoqiikvbii.supabase.co/storage/v1/object/public/products/story.webp" 
          alt="Story" 
          className="rounded-2xl mt-6 grayscale hover:grayscale-0 transition-all duration-700"
        />
      </div>
    </section>
  );
};

export default function About() {
  return (
   <AboutComponent />
  );
}



