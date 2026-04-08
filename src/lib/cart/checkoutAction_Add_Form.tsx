'use client'

import { useState, useMemo } from 'react';
import { checkoutAction } from "./checkouAction_Add";
import { CheckoutInput } from "../typeInterfaces/orderAddress";
// Import Mock Data
import { MOCK_PROVINCES, MOCK_DISTRICTS, MOCK_WARDS } from "./addressMock";
import { revalidatePath } from "next/cache";

/*
'use client'

import { useState, useMemo } from 'react';
import { checkoutAction } from "./checkouAction_Add";
import { CheckoutInput } from "../typeInterfaces/orderAddress";
// Import Mock Data
import { MOCK_PROVINCES, MOCK_DISTRICTS, MOCK_WARDS } from "./addressMock";
*/

export default function CheckoutForm() {
  const [isPending, setIsPending] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay'>('cod'); // Mặc định là COD

  const [form, setForm] = useState<CheckoutInput>({
    full_name: '', 
    phone: '', 
    email: '', 
    address_line1: '',
    province_id: 0, 
    province_name: '',
    district_id: 0, 
    district_name: '',
    ward_code: '', 
    ward_name: ''
  });

  const districts = useMemo(() => {
    return form.province_id ? MOCK_DISTRICTS[form.province_id] || [] : [];
  }, [form.province_id]);

  const wards = useMemo(() => {
    return form.district_id ? MOCK_WARDS[form.district_id] || [] : [];
  }, [form.district_id]);

/* Gốc chạy được
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.province_id === 0 || form.district_id === 0 || !form.ward_code) {
      alert("Vui lòng chọn đầy đủ Tỉnh, Quận và Phường");
      return;
    }

    setIsPending(true);
    try {
      const res = await checkoutAction(form);
      if (res.success) {
        alert('Mã đơn: '+res.orderCode)
        window.location.href = `/orders/${res.orderId}`;
      } else {
        alert(res.error);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi xử lý đơn hàng");
    } finally {
      setIsPending(false);
    }
  };
*/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.province_id === 0 || form.district_id === 0 || !form.ward_code) {
      alert("Vui lòng chọn đầy đủ Tỉnh, Quận và Phường");
      return;
    }

    setIsPending(true);
    try {
      const res = await checkoutAction(form);
      if (res.success) {
        if (paymentMethod === 'vnpay') {
          // 2. Nếu tạo xong record trong DB, gọi tiếp API VNPay
          const vnpRes = await fetch('/api/payment/create-vnpay', {
            method: 'POST',
            body: JSON.stringify({
              orderId: res.orderCode, // Mã ORD-... mà action trả về
              totalPrice: Number(res.totalPrice)     // total từ CartPage truyền xuống
            })
          });
          alert('Mã đơn: '+res.orderCode)
          const { url } = await vnpRes.json();
          if (url) {
            window.location.href = url; // Nhảy sang trang thanh toán VNPay
          }
        } else {
          // Nếu là COD thì về trang thành công luôn
          window.location.href = `/orders/${res.orderId}`;
        }
      } else {
        alert(res.error);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi xử lý đơn hàng");
    } finally {
      setIsPending(false);
    }
  };





/*
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsPending(true);

  try {
    // 1. Chạy Server Action để tạo đơn hàng trong DB trước
    const res = await checkoutAction(form); 

    if (res.success) {
      // 2. Nếu tạo xong record trong DB, gọi tiếp API VNPay
      const vnpRes = await fetch('/api/payment/vnpay/create', {
        method: 'POST',
        body: JSON.stringify({
          orderId: res.orderIdText, // Mã ORD-... mà action trả về
          totalPrice: totalPrice     // total từ CartPage truyền xuống
        })
      });

      const { url } = await vnpRes.json();
      if (url) {
        window.location.href = url; // Nhảy sang trang thanh toán VNPay
      }
    }
  } catch (err) {
    alert("Lỗi rồi!");
  } finally {
    setIsPending(false);
  }
};
*/













  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-2xl mx-auto p-4 md:p-6 space-y-4 bg-card border border-border rounded-2xl shadow-xl transition-colors duration-300"
    >
      <h2 className="text-xl font-bold text-primary mb-3 md:mb-6 tracking-wide uppercase">
        Thông tin nhận hàng
      </h2>
      
      {/* Name & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          placeholder="Họ tên" 
          className="bg-background border border-border p-3 rounded-lg focus:border-primary outline-none text-foreground transition-all placeholder:opacity-50"
          onChange={e => setForm({...form, full_name: e.target.value})} 
          required 
        />
        <input 
          placeholder="Số điện thoại" 
          className="bg-background border border-border p-3 rounded-lg focus:border-primary outline-none text-foreground transition-all placeholder:opacity-50"
          onChange={e => setForm({...form, phone: e.target.value})} 
          required 
        />
      </div>

      {/* Select Tỉnh/Thành */}
      <select 
        className="w-full bg-background border border-border p-3 rounded-lg text-foreground outline-none focus:border-primary appearance-none cursor-pointer transition-all"
        value={form.province_id}
        onChange={(e) => {
          const opt = e.target.selectedOptions[0];
          setForm({
            ...form, 
            province_id: Number(e.target.value), 
            province_name: opt.text,
            district_id: 0, district_name: '', ward_code: '', ward_name: '' 
          });
        }}
        required
      >
        <option value="0">--- Chọn Tỉnh/Thành ---</option>
        {MOCK_PROVINCES.map(p => (
          <option key={p.id} value={p.id} className="bg-card">{p.name}</option>
        ))}
      </select>

      {/* Select Quận/Huyện */}
      <select 
        disabled={!form.province_id}
        className="w-full bg-background border border-border p-3 rounded-lg text-foreground outline-none focus:border-primary disabled:opacity-30 transition-all appearance-none cursor-pointer"
        value={form.district_id}
        onChange={(e) => {
          const opt = e.target.selectedOptions[0];
          setForm({
            ...form, 
            district_id: Number(e.target.value), 
            district_name: opt.text,
            ward_code: '', ward_name: '' 
          });
        }}
        required
      >
        <option value="0">--- Chọn Quận/Huyện ---</option>
        {districts.map(d => (
          <option key={d.id} value={d.id} className="bg-card">{d.name}</option>
        ))}
      </select>

      {/* Select Phường/Xã */}
      <select 
        disabled={!form.district_id}
        className="w-full bg-background border border-border p-3 rounded-lg text-foreground outline-none focus:border-primary disabled:opacity-30 transition-all appearance-none cursor-pointer"
        value={form.ward_code}
        onChange={(e) => {
          const opt = e.target.selectedOptions[0];
          setForm({
            ...form, 
            ward_code: e.target.value, 
            ward_name: opt.text 
          });
        }}
        required
      >
        <option value="">--- Chọn Phường/Xã ---</option>
        {wards.map(w => (
          <option key={w.code} value={w.code} className="bg-card">{w.name}</option>
        ))}
      </select>

      {/* Địa chỉ chi tiết */}
      <input 
        placeholder="Số nhà, tên đường..." 
        className="w-full bg-background border border-border p-3 rounded-lg focus:border-neon-cyan outline-none text-foreground transition-all placeholder:opacity-50"
        onChange={e => setForm({...form, address_line1: e.target.value})} 
        required 
      />

     {/* THÊM PHẦN CHỌN PHƯƠNG THỨC THANH TOÁN */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold opacity-70">Phương thức thanh toán</p>
        <div className="grid grid-cols-2 gap-3">
          <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/10' : 'border-border'}`}>
            <input type="radio" className="hidden" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
            <span className="text-sm font-medium">Tiền mặt (COD)</span>
          </label>
          <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'vnpay' ? 'border-primary bg-primary/10' : 'border-border'}`}>
            <input type="radio" className="hidden" name="payment" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} />
            <span className="text-sm font-medium">VNPay (QR/Thẻ)</span>
          </label>
        </div>
      </div>

      <button 
        disabled={isPending}
        className={`w-full py-4 rounded-full font-bold tracking-[0.2em] transition-all duration-500 uppercase text-sm mt-4 
          ${isPending 
            ? "bg-border text-muted-foreground animate-pulse cursor-not-allowed" 
            : "bg-foreground text-background hover:bg-primary hover:text-white hover:scale-[1.02]"
          }`}
      >
        {isPending ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT HÀNG"}
      </button>
    </form>
  );
}


//export default 
function CheckoutForm__() {
  const [isPending, setIsPending] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay'>('cod'); // Mặc định là COD

  const [form, setForm] = useState<CheckoutInput>({
    full_name: '', 
    phone: '', 
    email: '', 
    address_line1: '',
    province_id: 0, 
    province_name: '',
    district_id: 0, 
    district_name: '',
    ward_code: '', 
    ward_name: ''
  });

  // Lấy danh sách Huyện dựa trên Tỉnh đang chọn
  const districts = useMemo(() => {
    return form.province_id ? MOCK_DISTRICTS[form.province_id] || [] : [];
  }, [form.province_id]);

  // Lấy danh sách Xã dựa trên Huyện đang chọn
  const wards = useMemo(() => {
    return form.district_id ? MOCK_WARDS[form.district_id] || [] : [];
  }, [form.district_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra nhanh trước khi gửi
    if (form.province_id === 0 || form.district_id === 0 || !form.ward_code) {
      alert("Vui lòng chọn đầy đủ Tỉnh, Quận và Phường");
      return;
    }

    setIsPending(true);
    try {
      const res = await checkoutAction(form);
      if (res.success) {
        window.location.href = `/orders/${res.orderId}`;
      } else {
        alert(res.error);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi xử lý đơn hàng");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4 bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-xl">
      <h2 className="text-xl font-light text-forest-green mb-6 tracking-wide">Thông tin nhận hàng</h2>
      
      {/* Name & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          placeholder="Họ tên" 
          className="bg-white/5 border border-white/10 p-3 rounded-lg focus:border-neon-cyan outline-none text-white transition-all"
          onChange={e => setForm({...form, full_name: e.target.value})} 
          required 
        />
        <input 
          placeholder="Số điện thoại" 
          className="bg-white/5 border border-white/10 p-3 rounded-lg focus:border-neon-cyan outline-none text-white transition-all"
          onChange={e => setForm({...form, phone: e.target.value})} 
          required 
        />
      </div>

      {/* Select Tỉnh/Thành */}
      <select 
        className="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-lg text-white outline-none focus:border-neon-cyan"
        value={form.province_id}
        onChange={(e) => {
          const opt = e.target.selectedOptions[0];
          setForm({
            ...form, 
            province_id: Number(e.target.value), 
            province_name: opt.text,
            district_id: 0, district_name: '', ward_code: '', ward_name: '' // Reset các cấp con
          });
        }}
        required
      >
        <option value="0">--- Chọn Tỉnh/Thành ---</option>
        {MOCK_PROVINCES.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {/* Select Quận/Huyện */}
      <select 
        disabled={!form.province_id}
        className="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-lg text-white outline-none focus:border-neon-cyan disabled:opacity-20 transition-opacity"
        value={form.district_id}
        onChange={(e) => {
          const opt = e.target.selectedOptions[0];
          setForm({
            ...form, 
            district_id: Number(e.target.value), 
            district_name: opt.text,
            ward_code: '', ward_name: '' // Reset xã
          });
        }}
        required
      >
        <option value="0">--- Chọn Quận/Huyện ---</option>
        {districts.map(d => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>

      {/* Select Phường/Xã */}
      <select 
        disabled={!form.district_id}
        className="w-full bg-[#1a1a1a] border border-white/10 p-3 rounded-lg text-white outline-none focus:border-neon-cyan disabled:opacity-20 transition-opacity"
        value={form.ward_code}
        onChange={(e) => {
          const opt = e.target.selectedOptions[0];
          setForm({
            ...form, 
            ward_code: e.target.value, 
            ward_name: opt.text 
          });
        }}
        required
      >
        <option value="">--- Chọn Phường/Xã ---</option>
        {wards.map(w => (
          <option key={w.code} value={w.code}>{w.name}</option>
        ))}
      </select>

      {/* Địa chỉ chi tiết */}
      <input 
        placeholder="Số nhà, tên đường..." 
        className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:border-neon-purple outline-none text-white transition-all"
        onChange={e => setForm({...form, address_line1: e.target.value})} 
        required 
      />

     {/* THÊM PHẦN CHỌN PHƯƠNG THỨC THANH TOÁN */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold opacity-70">Phương thức thanh toán</p>
        <div className="grid grid-cols-2 gap-3">
          <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/10' : 'border-border'}`}>
            <input type="radio" className="hidden" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
            <span className="text-sm font-medium">Tiền mặt (COD)</span>
          </label>
          <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'vnpay' ? 'border-primary bg-primary/10' : 'border-border'}`}>
            <input type="radio" className="hidden" name="payment" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} />
            <span className="text-sm font-medium">VNPay (QR/Thẻ)</span>
          </label>
        </div>
      </div>

      <button 
        disabled={isPending}
        className="w-full py-4 bg-white text-black rounded-full font-bold tracking-[0.2em] hover:bg-neon-cyan hover:text-white transition-all duration-500 disabled:opacity-50 uppercase text-sm mt-4"
      >
        {isPending ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT HÀNG"}
      </button>
    </form>
  );
}











