
/*
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
      await dbSql.update(orders)
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
      await dbSql.update(orders)
        .set({ status: 'cancelled', updated_at: new Date() })
        .where(eq(orders.order_id, orderIdText));
        
      return Response.json({ RspCode: '00', Message: 'Confirm Success (Payment Fail)' });
    }
  } catch (error) {
    return Response.json({ RspCode: '99', Message: 'Unknow Error' });
  }
}
*/

import { dbSql } from "@/lib/dbSql";
import { orders } from "@/lib/payment/schema";
import { eq } from "drizzle-orm";
import crypto from 'crypto';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vnp_Params: any = Object.fromEntries(searchParams.entries());

    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // 1. Sắp xếp tham số Alphabet
    const sortedKeys = Object.keys(vnp_Params).sort();

    // 2. Tạo chuỗi dữ liệu kiểm tra (Phải dùng encodeURIComponent + replace giống hệt lúc tạo link)
    const signData = sortedKeys
      .map((key) => `${key}=${encodeURIComponent(vnp_Params[key]).replace(/%20/g, '+')}`)
      .join('&');

    const secretKey = process.env.VNP_HASH_SECRET!;
    const signed = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(signData, 'utf-8'))
      .digest("hex");

    // 3. Kiểm tra chữ ký
    if (secureHash !== signed) {
      return Response.json({ RspCode: '97', Message: 'Invalid signature' });
    }

    const orderIdText = vnp_Params['vnp_TxnRef'];
    const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
    const transactionNo = vnp_Params['vnp_TransactionNo'];

    // 4. Kiểm tra đơn hàng trong DB của Tâm Việt
    const order = await dbSql.query.orders.findFirst({
      where: eq(orders.order_id, orderIdText),
    });

    if (!order) {
      return Response.json({ RspCode: '01', Message: 'Order not found' });
    }

    // Nếu đơn hàng đã được cập nhật trước đó rồi (bởi Return URL hoặc IPN trước)
    if (order.status !== 'pending') {
      return Response.json({ RspCode: '02', Message: 'Order already confirmed' });
    }

    // 5. Cập nhật trạng thái
    if (vnp_ResponseCode === '00') {
      // Thanh toán thành công
      await dbSql.update(orders)
        .set({ 
          status: 'paid',
          payment_method: 'vnpay',
          payment_gateway_id: transactionNo,
          updated_at: new Date()
        })
        .where(eq(orders.order_id, orderIdText));
    } else {
      // Thanh toán lỗi hoặc khách hủy
      await dbSql.update(orders)
        .set({ 
          status: 'cancelled', 
          updated_at: new Date() 
        })
        .where(eq(orders.order_id, orderIdText));
    }

    // Trả về cho VNPay biết đã nhận thông tin thành công
    return Response.json({ RspCode: '00', Message: 'Confirm Success' });

  } catch (error) {
    console.error("IPN Error:", error);
    return Response.json({ RspCode: '99', Message: 'Unknown Error' });
  }
}




