'use client';

import { useRef, useState } from "react";
import { addPolicyAction } from "@/chatbotv1/addPolicy";
import { toast } from "sonner";

export default function AdminPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);

  async function clientAction(formData: FormData) {
    setIsPending(true);
    const result = await addPolicyAction(formData);
    setIsPending(false);
    
    if (result.success) {
      toast.success("Dữ liệu đã được vector hóa và lưu trữ!");
      formRef.current?.reset();
    } else {
      toast.error(result.error || "Có lỗi xảy ra");
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto min-h-screen bg-transparent font-sans">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
            Knowledge Base
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mt-1">Nạp trí tuệ cho Stoic Bot</p>
        </div>
      </div>
      
      <form 
        ref={formRef}
        action={clientAction} 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card/40 backdrop-blur-2xl p-8 rounded-[40px] border border-white/5 shadow-2xl"
      >
        {/* Tiêu đề tài liệu */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest ml-4 opacity-40">Tiêu đề đoạn trích</label>
          <input 
            name="title" 
            required
            className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all placeholder:opacity-20"
            placeholder="VD: Chính sách nghỉ phép năm 2026 (Phần 1)"
          />
        </div>

        {/* Nội dung chính */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest ml-4 opacity-40">Nội dung văn bản (Chunk)</label>
          <textarea 
            name="content" 
            rows={10} 
            required
            className="w-full px-6 py-5 bg-black/20 border border-white/5 rounded-[32px] focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all resize-none leading-relaxed"
            placeholder="Dán nội dung cần vector hóa vào đây..."
          />
        </div>
        
        {/* Phân loại & Danh mục */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest ml-4 opacity-40">Danh mục chính</label>
          <select 
            name="category"
            className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl focus:ring-1 focus:ring-primary/50 appearance-none outline-none"
          >
            <option value="HR">Nhân sự (HR)</option>
            <option value="Finance">Tài chính (Finance)</option>
            <option value="IT">Kỹ thuật (IT)</option>
            <option value="General">Quy định chung</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest ml-4 opacity-40">Độ ưu tiên (0 - 10)</label>
          <input 
            type="number"
            name="priority" 
            defaultValue="0"
            className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all"
          />
        </div>

        {/* Nút Submit */}
        <div className="md:col-span-2 pt-4">
          <button 
            type="submit" 
            disabled={isPending}
            className={`w-full py-5 bg-white text-black rounded-[24px] font-black uppercase tracking-widest transition-all shadow-xl hover:bg-primary hover:text-white flex items-center justify-center gap-3 ${isPending ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
          >
            {isPending ? (
              <span className="animate-pulse">Đang nạp vào ma trận...</span>
            ) : (
              <>
                <span>Nạp Dữ Liệu Vector</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-8 flex justify-between items-center px-4 opacity-20 text-[9px] font-mono uppercase tracking-[0.3em]">
        <span>Status: System Ready</span>
        <span>Latent Space Optimization Active</span>
      </div>
    </div>
  );
}
