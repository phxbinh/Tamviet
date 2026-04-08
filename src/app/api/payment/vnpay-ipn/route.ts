import { dbSql } from "@/lib/dbSql";
import { orders } from "@/lib/payment/schema";
import { eq } from "drizzle-orm";
import qs from 'qs';
import crypto from 'crypto';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let vnp_Params = Object.fromEntries(searchParams.entries());
  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // 1. Kiểm tra chữ ký bảo mật
  const signData = qs.stringify(Object.keys(vnp_Params).sort().reduce((obj: any, key) => {
    obj[key] = vnp_Params[key];
    return obj;
  }, {}), { encode: false });
  
  const signed = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET!).update(Buffer.from(signData, 'utf-8')).digest("hex");

  if (secureHash !== signed) {
    return Response.json({ RspCode: '97', Message: 'Invalid signature' });
  }

  // 2. Lấy dữ liệu từ VNPay trả về
  const orderIdText = vnp_Params['vnp_TxnRef']; // Mã ORD-...
  const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
  const transactionNo = vnp_Params['vnp_TransactionNo'];

  try {
    // 3. Cập nhật bảng orders dựa trên order_id
    if (vnp_ResponseCode === '00') {
      await db.update(orders)
        .set({ 
          status: 'paid', // Chuyển từ pending sang paid
          payment_method: 'vnpay',
          payment_gateway_id: transactionNo, // Lưu mã giao dịch để đối soát
          updated_at: new Date()
        })
        .where(eq(orders.order_id, orderIdText)); // Query bằng cột order_id duy nhất
      
      return Response.json({ RspCode: '00', Message: 'Confirm Success' });
    } else {
      // Trường hợp lỗi hoặc hủy thanh toán
      await db.update(orders)
        .set({ status: 'cancelled', updated_at: new Date() })
        .where(eq(orders.order_id, orderIdText));
        
      return Response.json({ RspCode: '00', Message: 'Confirm Success (Payment Fail)' });
    }
  } catch (error) {
    return Response.json({ RspCode: '99', Message: 'Unknow Error' });
  }
}
