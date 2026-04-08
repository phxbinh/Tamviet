/*
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import moment from 'moment';
import qs from 'qs';

export async function POST(req: Request) {
  const { orderId, totalPrice } = await req.json(); // orderId ở đây là mã 'ORD-...'

  const secretKey = process.env.VNP_HASH_SECRET!;
  const vnpUrl = process.env.VNP_URL!;
  
  let vnp_Params: any = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: process.env.NEXT_PUBLIC_VNP_TMN_CODE,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId, // Dùng cột order_id (ORD-...) để VNPay hiển thị cho khách
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: 'other',
    vnp_Amount: Number(totalPrice) * 100,
    vnp_ReturnUrl: process.env.VNP_RETURN_URL,
    vnp_IpAddr: '127.0.0.1',
    vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
  };

  // Sắp xếp và ký
  vnp_Params = Object.keys(vnp_Params).sort().reduce((obj: any, key) => {
    obj[key] = vnp_Params[key];
    return obj;
  }, {});

  const signData = qs.stringify(vnp_Params, { encode: false });
  const signed = crypto.createHmac("sha512", secretKey).update(Buffer.from(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;

  return NextResponse.json({ url: vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false }) });
}
*/

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import moment from 'moment';
import qs from 'qs';

export async function POST(req: Request) {
  try {
    const { orderId, totalPrice } = await req.json();

    const secretKey = process.env.VNP_HASH_SECRET!;
    const vnpUrl = process.env.VNP_URL!;
    const tmnCode = process.env.NEXT_PUBLIC_VNP_TMN_CODE!;
    const returnUrl = process.env.VNP_RETURN_URL!;

    // 1. Lấy IP người dùng thực tế
    const ipAddr = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    
    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'other',
      // 2. Chuẩn hoá số tiền chính xác
      vnp_Amount: Math.round(Number(totalPrice)) * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
    };

    // 3. Sắp xếp tham số A-Z (Bắt buộc)
    vnp_Params = Object.keys(vnp_Params).sort().reduce((obj: any, key) => {
      obj[key] = vnp_Params[key];
      return obj;
    }, {});

    // 4. Tạo chữ ký (Dùng encode: false ở bước này)
    const signData = qs.stringify(vnp_Params, { encode: false });
    const signed = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(signData, 'utf-8'))
      .digest("hex");
    
    vnp_Params['vnp_SecureHash'] = signed;

    // 5. Trả về URL (Dùng encode: true ở bước này - mặc định của qs)
    const paymentUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: true });

    return NextResponse.json({ url: paymentUrl });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi tạo link thanh toán" }, { status: 500 });
  }
}



