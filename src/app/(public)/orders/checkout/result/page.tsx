// app/(shop)/checkout/result/page.tsx
// ùung cho gôc: Chạy được
import crypto from 'crypto';
import Link from 'next/link';
import { CheckCircle2, XCircle, Package, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';


//import crypto from 'crypto';
import PaymentReceipt from './_components/PaymentReceipt';



// Lấy full data của order
import { getFullOrderForReceipt } from './_components/getFullOrderForReceipt';
import { getFullOrderForReceipt_ } from './_components/getFullOrderForReceipt_';
import PaymentReceipt_ from './_components/PaymentReceipt_';


export default async function PaymentResultPage({ searchParams }: { searchParams: any }) {
  const vnp_Params = { ...searchParams };
  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const sortedKeys = Object.keys(vnp_Params).sort();
  const signData = sortedKeys
    .map((key) => `${key}=${encodeURIComponent(vnp_Params[key]).replace(/%20/g, '+')}`)
    .join('&');

  const secretKey = process.env.VNP_HASH_SECRET!;
  const signed = crypto.createHmac("sha512", secretKey).update(Buffer.from(signData, 'utf-8')).digest("hex");

  const isSignatureValid = secureHash === signed;
  const isSuccess = isSignatureValid && vnp_Params['vnp_ResponseCode'] === '00';
  
  const orderId = vnp_Params['vnp_TxnRef'];
  const amount = Number(vnp_Params['vnp_Amount']) / 100;

  // Thêm cái này để lấy data của order
  const data = await getFullOrderForReceipt_(orderId);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased">
      <PaymentReceipt_ 
        isSuccess={isSuccess} 
        orderId={orderId} 
        amount={amount} 
        data={data} // Truyền data vào
      />
    </div>
  );
}

// Gôc chạy được
//export default 
function PaymentResultPage_({ searchParams }: { searchParams: any }) {
  const vnp_Params = { ...searchParams };
  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const sortedKeys = Object.keys(vnp_Params).sort();
  const signData = sortedKeys
    .map((key) => `${key}=${encodeURIComponent(vnp_Params[key]).replace(/%20/g, '+')}`)
    .join('&');

  const secretKey = process.env.VNP_HASH_SECRET!;
  const signed = crypto.createHmac("sha512", secretKey).update(Buffer.from(signData, 'utf-8')).digest("hex");

  const isSignatureValid = secureHash === signed;
  const isSuccess = isSignatureValid && vnp_Params['vnp_ResponseCode'] === '00';
  
  const orderId = vnp_Params['vnp_TxnRef'];
  const amount = Number(vnp_Params['vnp_Amount']) / 100;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased">
      <div className="max-w-xl w-full">
        {/* Card chính */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          
          {/* Header trạng thái */}
          <div className={`p-8 text-center ${isSuccess ? 'bg-emerald-50' : 'bg-rose-50'}`}>
            <div className="flex justify-center mb-4">
              {isSuccess ? (
                <div className="bg-emerald-500 p-3 rounded-full animate-bounce-short">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              ) : (
                <div className="bg-rose-500 p-3 rounded-full animate-pulse">
                  <XCircle className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            <h1 className={`text-3xl font-extrabold ${isSuccess ? 'text-emerald-900' : 'text-rose-900'}`}>
              {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán chưa hoàn tất'}
            </h1>
            <p className={`mt-2 font-medium ${isSuccess ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isSuccess 
                ? 'Đơn hàng của bạn đã được hệ thống xác nhận an toàn.' 
                : 'Đã có lỗi xảy ra hoặc giao dịch bị hủy bỏ.'}
            </p>
          </div>

          {/* Chi tiết đơn hàng */}
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
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {isSuccess ? 'Đã thanh toán' : 'Thất bại'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-600 font-medium">Tổng tiền thanh toán</span>
                <span className="text-2xl font-black text-blue-600">
                  {amount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            {/* Điều hướng */}
            <div className="mt-10 space-y-4">
              {isSuccess ? (
                <Link 
                  href="/orders"
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-slate-200"
                >
                  Theo dõi đơn hàng <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link 
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-rose-200"
                >
                  Thử thanh toán lại
                </Link>
              )}
              
              <Link 
                href="/"
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
              >
                <ShoppingBag className="w-5 h-5" /> Quay lại cửa hàng
              </Link>
            </div>
          </div>

          {/* Footer an toàn */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Thanh toán bảo mật bởi VNPay & Tâm Việt</span>
          </div>
        </div>

        {/* Thông điệp hỗ trợ */}
        <p className="text-center mt-6 text-slate-400 text-sm">
          Bạn gặp vấn đề? Liên hệ hỗ trợ: <span className="font-bold text-slate-500">0123-456-789</span>
        </p>
      </div>
    </div>
  );
}
