'use client'; // Chuyển sang Client Component để xử lý thông báo

import { useRef } from "react";
import { addPolicyAction } from "@/dbchatbot/postPolicies";
import { toast } from "sonner"; // Hoặc bất kỳ thư viện thông báo nào bạn thích

export default function AdminPage() {
  const formRef = useRef<HTMLFormElement>(null);

  async function clientAction(formData: FormData) {
    const result = await addPolicyAction(formData);
    
    if (result.success) {
      toast.success("Đã nạp vào ma trận thành công!");
      formRef.current?.reset(); // Xóa sạch form để nạp đoạn tiếp theo
    } else {
      toast.error(result.error || "Có lỗi xảy ra");
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto min-h-screen bg-transparent">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-neon-cyan rounded-full" />
        <h1 className="text-3xl font-black tracking-tighter uppercase opacity-90">
          Hệ Thống Nạp Dữ Liệu
        </h1>
      </div>
      
      <form 
        ref={formRef}
        action={clientAction} 
        className="space-y-6 bg-card/50 backdrop-blur-xl p-6 rounded-[32px] border border-border/50 shadow-2xl"
      >
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest ml-1 opacity-50">
            Nội dung chính sách
          </label>
          <textarea 
            name="content" 
            rows={8} 
            required
            className="w-full p-4 bg-black/20 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all resize-none"
            placeholder="Dán nội dung văn bản tại đây (Khoảng 300-500 từ mỗi lần là tốt nhất)..."
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest ml-1 opacity-50">
            Nguồn / Metadata
          </label>
          <input 
            name="metadata" 
            className="w-full p-4 bg-black/20 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
            placeholder="VD: Sổ tay nhân viên 2026 - Chương 1"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.01] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <span>Đẩy vào Neon Vector</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </form>
      
      <p className="mt-6 text-[10px] text-center opacity-30 font-mono uppercase tracking-[0.2em]">
        Powered by Gemini 1.5 Flash & Neon Postgres
      </p>
    </div>
  );
}
