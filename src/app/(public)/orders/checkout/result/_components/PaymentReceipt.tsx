'use client';

import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import Link from 'next/link';
import { CheckCircle2, XCircle, Package, ArrowRight, ShieldCheck, ShoppingBag, Download } from 'lucide-react';

interface PaymentReceiptProps {
  isSuccess: boolean;
  orderId: string;
  amount: number;
}

export default function PaymentReceipt({ isSuccess, orderId, amount }: PaymentReceiptProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage_ = async () => {
    if (cardRef.current === null) return;
    
    try {
      // Ẩn các nút điều hướng tạm thời trước khi chụp nếu muốn (tùy chọn)
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        backgroundColor: '#ffffff', // Đảm bảo nền trắng
      });
      
      const link = document.createElement('a');
      link.download = `bien-lai-${orderId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Lỗi xuất ảnh:', err);
      alert('Không thể xuất ảnh, vui lòng thử lại sau.');
    }
  };



const handleDownloadImage = async () => {
  if (cardRef.current === null) return;

  try {
    const dataUrl = await toPng(cardRef.current, { 
      cacheBust: true,
      pixelRatio: 3, // Tăng độ nét cho mobile
    });

    // Chuyển đổi DataURL (base64) sang File object để có thể chia sẻ
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `receipt-${orderId}.png`, { type: 'image/png' });

    // Kiểm tra xem trình duyệt có hỗ trợ chia sẻ file không (Hầu hết mobile hiện đại đều hỗ trợ)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Biên lai thanh toán',
        text: `Biên lai cho đơn hàng ${orderId}`,
      });
    } else {
      // Nếu không hỗ trợ share (như trên Desktop), quay lại cách tải về truyền thống
      const link = document.createElement('a');
      link.download = `receipt-${orderId}.png`;
      link.href = dataUrl;
      link.click();
    }
  } catch (err) {
    console.error('Lỗi:', err);
  }
};







  return (
    <div className="max-w-xl w-full">
      {/* Nút tải ảnh nằm ngoài Card chính */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleDownloadImage}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full transition-colors"
        >
          <Download className="w-4 h-4" /> Tải ảnh biên lai
        </button>
      </div>

      {/* Card chính - Phần này sẽ được chụp thành ảnh */}
      <div ref={cardRef} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        {/* Header trạng thái */}
        <div className={`p-8 text-center ${isSuccess ? 'bg-emerald-50' : 'bg-rose-50'}`}>
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <div className="bg-emerald-500 p-3 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            ) : (
              <div className="bg-rose-500 p-3 rounded-full">
                <XCircle className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
          <h1 className={`text-3xl font-extrabold ${isSuccess ? 'text-emerald-900' : 'text-rose-900'}`}>
            {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán chưa hoàn tất'}
          </h1>
          <p className={`mt-2 font-medium ${isSuccess ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isSuccess ? 'Đơn hàng đã được xác nhận an toàn.' : 'Đã có lỗi hoặc giao dịch bị hủy.'}
          </p>
        </div>

        {/* Chi tiết */}
        <div className="p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <Package className="text-slate-400 w-5 h-5" />
                <span className="text-slate-600 font-medium">Mã đơn hàng</span>
              </div>
              <span className="font-bold text-slate-900">{orderId}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-slate-400 w-5 h-5" />
                <span className="text-slate-600 font-medium">Trạng thái</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {isSuccess ? 'Đã thanh toán' : 'Thất bại'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-600 font-medium">Tổng tiền</span>
              <span className="text-2xl font-black text-blue-600">
                {amount.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
        </div>

        {/* Footer nội bộ của ảnh */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Thanh toán bảo mật bởi VNPay & Tâm Việt</span>
        </div>
      </div>

      {/* Điều hướng - Nằm ngoài phần chụp ảnh hoặc giữ lại tùy bạn */}
      <div className="mt-8 space-y-4">
        {isSuccess ? (
          <Link href="/orders" className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-bold">
            Theo dõi đơn hàng <ArrowRight className="w-5 h-5" />
          </Link>
        ) : (
          <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white py-4 rounded-xl font-bold">
            Thử thanh toán lại
          </Link>
        )}
        <Link href="/" className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-600 py-4 rounded-xl font-bold">
          <ShoppingBag className="w-5 h-5" /> Quay lại cửa hàng
        </Link>
      </div>
    </div>
  );
}
