'use client';

import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Link from 'next/link';
import { CheckCircle2, XCircle, Package, ArrowRight, ShieldCheck, ShoppingBag, Download } from 'lucide-react';

interface PaymentReceiptProps {
  isSuccess: boolean;
  orderId: string;
  amount: number;
  data: any; // { order, address, items }
}


export default function PaymentReceipt_({ isSuccess, orderId, amount, data }: PaymentReceiptProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // 👉 Chỉ mark ready khi data đủ
  useEffect(() => {
    if (data && data.address && data.items) {
      setIsReady(true);
    }
  }, [data]);

  // 👉 Loading UI (skeleton đơn giản)
  if (!isReady) {
    return (
      <div className="max-w-xl w-full animate-pulse">
        <div className="h-10 bg-slate-200 rounded mb-4"></div>
        <div className="bg-white rounded-3xl shadow p-6 space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-20 bg-slate-200 rounded"></div>
          <div className="h-16 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        pixelRatio: 3,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `receipt-${orderId}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Biên lai thanh toán',
          text: `Biên lai cho đơn hàng ${orderId}`,
        });
      } else {
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
      {/* 👉 Debug nếu cần */}
       <pre>{JSON.stringify(data, null, 2)}</pre> 

      <div className="flex justify-end mb-4">
        <button 
          onClick={handleDownloadImage}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full"
        >
          <Download className="w-4 h-4" /> Tải ảnh biên lai
        </button>
      </div>

      <div ref={cardRef} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className={`p-5 text-center ${isSuccess ? 'bg-emerald-50' : 'bg-rose-50'}`}>
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <div className="bg-emerald-500 p-3 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
            ) : (
              <div className="bg-rose-500 p-3 rounded-full">
                <XCircle className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          <h1 className="text-xl font-extrabold">
            {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán chưa hoàn tất'}
          </h1>
        </div>

        {/* Body */}
        <div className="p-6 text-sm space-y-4">

          <div className="flex justify-between border-b pb-2">
            <span>Mã đơn</span>
            <span className="font-semibold">{orderId}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Trạng thái</span>
            <span className={isSuccess ? 'text-emerald-600' : 'text-rose-600'}>
              {isSuccess ? 'Đã thanh toán' : 'Thất bại'}
            </span>
          </div>

          {/* Address */}
          <div className="border-b pb-2">
            <p className="text-slate-500 mb-1">Giao đến</p>
            <div className="font-medium">
              {data.address.full_name} - {data.address.phone}
            </div>
            <div className="text-xs text-slate-500">
              {data.address.address_line1}, {data.address.ward_name}, {data.address.district_name}, {data.address.province_name}
            </div>
          </div>

          {/* Items */}
          <div className="border-b pb-2">
            <p className="text-slate-500 mb-2">Sản phẩm</p>
            {data.items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-xs">
                <span>{item.title} × {item.quantity}</span>
                <span>
                  {(item.price_at_time * item.quantity).toLocaleString("vi-VN")}đ
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <span>Tổng tiền</span>
            <span className="text-lg font-bold text-blue-600">
              {amount.toLocaleString('vi-VN')}đ
            </span>
          </div>

        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Thanh toán bảo mật bởi VNPay & Tâm Việt</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 space-y-4">
        {isSuccess ? (
          <Link href="/orders" className="block text-center bg-black text-white py-3 rounded-xl">
            Theo dõi đơn hàng
          </Link>
        ) : (
          <Link href="/checkout" className="block text-center bg-red-500 text-white py-3 rounded-xl">
            Thử lại
          </Link>
        )}
      </div>
    </div>
  );
}








// Chạy ổn
//export default 
function PaymentReceipt__({ isSuccess, orderId, amount, data }: PaymentReceiptProps) {
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
      <pre>{JSON.stringify(data.address, null, 2)}</pre>

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
        <div className="p-6 text-sm">
{/*
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
*/}

  <div className="space-y-4">

    {/* Order ID */}
    <div className="flex justify-between border-b pb-2">
      <span className="text-slate-500">Mã đơn</span>
      <span className="font-semibold">{orderId}</span>
    </div>

    {/* Status */}
    <div className="flex justify-between border-b pb-2">
      <span className="text-slate-500">Trạng thái</span>
      <span className={`text-xs font-bold ${
        isSuccess ? 'text-emerald-600' : 'text-rose-600'
      }`}>
        {isSuccess ? 'Đã thanh toán' : 'Thất bại'}
      </span>
    </div>

    {/* Address */}
    {data?.address && (
      <div className="border-b pb-2">
        <p className="text-slate-500 mb-1">Giao đến</p>
        <span className="font-medium">
          {data.address.full_name} - {data.address.phone}
        </span>
        <span className="text-xs text-slate-500">
          {data.address.address_line1}, {data.address.ward_name}, {data.address.district_name}, {data.address.province_name}
        </span>
      </div>
    )}

    {/* Items */}
    <div className="border-b pb-2">
      <p className="text-slate-500 mb-2">Sản phẩm</p>
      <div className="space-y-1">
        {data?.items?.map((item: any) => (
          <div key={item.id} className="flex justify-between text-xs">
            <span>
              {item.title || "Variant"} × {item.quantity}
            </span>
            <span className="font-medium">
              {(item.price_at_time * item.quantity).toLocaleString("vi-VN")}đ
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Total */}
    <div className="flex justify-between pt-2">
      <span className="text-slate-600">Tổng tiền</span>
      <span className="text-lg font-bold text-blue-600">
        {amount.toLocaleString('vi-VN')}đ
      </span>
    </div>

  </div>













        </div>

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
