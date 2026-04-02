// @/components/checkout/CheckoutForm.tsx 
'use client'
import { useState } from 'react';
import { checkoutAction } from "./checkouAction_Add";
import { CheckoutSchema, CheckoutInput } from "../typeInterfaces/orderAddress";

export default function CheckoutForm() {
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState<CheckoutInput>({
    full_name: '', phone: '', email: '', address_line1: '',
    province_id: 0, province_name: '',
    district_id: 0, district_name: '',
    ward_code: '', ward_name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const res = await checkoutAction(form);
    if (res.success) window.location.href = `/thank-you?id=${res.orderId}`;
    else alert(res.error);
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4 bg-[#0d0d0d] border border-white/10 rounded-2xl">
      <h2 className="text-xl font-light text-forest-green mb-6">Thông tin nhận hàng</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <input 
          placeholder="Họ tên" 
          className="bg-white/5 border border-white/10 p-3 rounded-lg focus:border-neon-cyan outline-none transition-all"
          onChange={e => setForm({...form, full_name: e.target.value})} 
          required 
        />
        <input 
          placeholder="Số điện thoại" 
          className="bg-white/5 border border-white/10 p-3 rounded-lg focus:border-neon-cyan outline-none"
          onChange={e => setForm({...form, phone: e.target.value})} 
          required 
        />
      </div>

      {/* Select Tỉnh/Thành - Tương tự cho Quận/Huyện */}
      <select 
        className="w-full bg-white/5 border border-white/10 p-3 rounded-lg appearance-none"
        onChange={(e) => {
          const opt = e.target.selectedOptions[0];
          setForm({
            ...form, 
            province_id: Number(e.target.value), 
            province_name: opt.text,
            district_id: 0, district_name: '', ward_code: '', ward_name: '' // Reset con
          });
        }}
      >
        <option value="0">Chọn Tỉnh/Thành</option>
        {/* Render provinces from props or state */}
      </select>

      <input 
        placeholder="Số nhà, tên đường..." 
        className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:border-neon-purple outline-none"
        onChange={e => setForm({...form, address_line1: e.target.value})} 
        required 
      />

      <button 
        disabled={isPending}
        className="w-full py-4 bg-white text-black rounded-full font-bold tracking-widest hover:bg-neon-cyan hover:text-white transition-all duration-300 disabled:opacity-50"
      >
        {isPending ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT HÀNG"}
      </button>
    </form>
  );
}
