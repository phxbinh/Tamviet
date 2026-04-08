import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function PaymentResultPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const responseCode = searchParams['vnp_ResponseCode'];
  const isSuccess = responseCode === '00';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        {isSuccess ? (
          <>
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã tin tưởng Tâm Việt. Đơn hàng của bạn đang được xử lý.
            </p>
          </>
        ) : (
          <>
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thất bại</h1>
            <p className="text-gray-600 mb-6">
              Đã có lỗi xảy ra hoặc bạn đã hủy giao dịch. Vui lòng thử lại.
            </p>
          </>
        )}

        <div className="space-y-3">
          <Link 
            href="/orders" prefetch={true}
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Xem lịch sử đơn hàng
          </Link>
          <Link 
            href="/" prefetch={true}
            className="block w-full text-blue-600 py-2 font-medium hover:underline"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
