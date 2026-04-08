// app/(shop)/checkout/result/page.tsx
import crypto from 'crypto';

export default function PaymentResultPage({ searchParams }: { searchParams: any }) {
  const vnp_Params = { ...searchParams };
  const secureHash = vnp_Params['vnp_SecureHash'];

  // 1. Xóa các tham số hash để tính toán lại chữ ký
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // 2. Sắp xếp và băm lại để kiểm tra (Giống hệt logic ở file IPN)
  const sortedKeys = Object.keys(vnp_Params).sort();
  const signData = sortedKeys
    .map((key) => `${key}=${encodeURIComponent(vnp_Params[key]).replace(/%20/g, '+')}`)
    .join('&');

  const secretKey = process.env.VNP_HASH_SECRET!;
  const signed = crypto.createHmac("sha512", secretKey).update(Buffer.from(signData, 'utf-8')).digest("hex");

  const isSignatureValid = secureHash === signed;
  const isSuccess = vnp_Params['vnp_ResponseCode'] === '00';

  if (!isSignatureValid) {
    return <div>Cảnh báo: Dữ liệu thanh toán không hợp lệ (Sai chữ ký)!</div>;
  }

  return (
    <div>
      {isSuccess ? (
        <h1>Thanh toán thành công cho đơn hàng {vnp_Params['vnp_TxnRef']}</h1>
      ) : (
        <h1>Thanh toán thất bại hoặc đã bị hủy</h1>
      )}
    </div>
  );
}
