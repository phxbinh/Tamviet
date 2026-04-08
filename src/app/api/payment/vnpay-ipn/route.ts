/*
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import qs from 'qs';
import { db } from "@/lib/db"; // Import drizzle db của bạn
import { orders } from "@/lib/schema"; // Import schema của bạn
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let vnp_Params = Object.fromEntries(searchParams.entries());
    const secureHash = vnp_Params['vnp_SecureHash'];

    // Xóa hash để tính toán lại
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp lại alphabet
    vnp_Params = Object.keys(vnp_Params)
      .sort()
      .reduce((obj: any, key) => {
        obj[key] = vnp_Params[key];
        return obj;
      }, {});

    const secretKey = process.env.VNP_HASH_SECRET!;
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    // Kiểm tra chữ ký có khớp không (Chống hack)
    if (secureHash === signed) {
      const orderId = vnp_Params['vnp_TxnRef'];
      const rspCode = vnp_Params['vnp_ResponseCode'];

      // Kiểm tra trạng thái thanh toán từ VNPay (00 là thành công)
      if (rspCode === '00') {
        // Cập nhật trạng thái 'paid' vào Neon DB
        // Drizzle sẽ tự động đợi DB khởi động nếu đang ngủ đông
        await db.update(orders)
          .set({ 
            status: 'paid',
            updated_at: new Date()
          })
          .where(eq(orders.id, orderId));

        return NextResponse.json({ RspCode: '00', Message: 'Confirm Success' });
      } else {
        return NextResponse.json({ RspCode: '01', Message: 'Payment Failed' });
      }
    } else {
      return NextResponse.json({ RspCode: '97', Message: 'Invalid Checksum' });
    }
  } catch (error) {
    console.error("VNPAY_IPN_ERROR:", error);
    return NextResponse.json({ RspCode: '99', Message: 'Unknow Error' });
  }
}
*/