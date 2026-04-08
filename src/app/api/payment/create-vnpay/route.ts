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

// Chạy được
/*
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import moment from 'moment';

export async function POST(req: Request) {
  try {
    const { orderId, totalPrice } = await req.json();

    const secretKey = process.env.VNP_HASH_SECRET!;
    const vnpUrl = process.env.VNP_URL!;
    const tmnCode = process.env.NEXT_PUBLIC_VNP_TMN_CODE!;
    const returnUrl = process.env.VNP_RETURN_URL!;

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const ipAddr = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: 'Thanh toan cho ma don hang: ' + orderId,
      vnp_OrderType: 'other',
      vnp_Amount: Math.round(Number(totalPrice)) * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // 1. Sắp xếp các tham số theo alphabet
    const sortedKeys = Object.keys(vnp_Params).sort();
    
    // 2. Tạo chuỗi dữ liệu để ký (Query String không encode)
    const signData = sortedKeys
      .map((key) => `${key}=${encodeURIComponent(vnp_Params[key]).replace(/%20/g, '+')}`)
      .join('&');

    // 3. Tạo chuỗi query để nối vào URL (Có encode)
    const queryData = sortedKeys
      .map((key) => `${key}=${encodeURIComponent(vnp_Params[key]).replace(/%20/g, '+')}`)
      .join('&');

    // 4. Thực hiện băm HMAC-SHA512
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    // 5. Build URL cuối cùng
    const finalUrl = `${vnpUrl}?${queryData}&vnp_SecureHash=${signed}`;

    return NextResponse.json({ url: finalUrl });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
*/


import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { orderId, totalPrice } = await req.json();

    const secretKey = process.env.VNP_HASH_SECRET!;
    const vnpUrl = process.env.VNP_URL!;
    const tmnCode = process.env.NEXT_PUBLIC_VNP_TMN_CODE!;
    const returnUrl = process.env.VNP_RETURN_URL!;

    // 1. ÉP MÚI GIỜ VIỆT NAM (GMT+7) - Quan trọng để khớp chữ ký
    const now = new Date();
    const gmt7Date = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const createDate = gmt7Date.toISOString().replace(/[:T-]/g, '').slice(0, 14);

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
      vnp_Amount: Math.round(Number(totalPrice)) * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // 2. SẮP XẾP ALPHABET VÀ TẠO CHUỖI KÝ
    const sortedKeys = Object.keys(vnp_Params).sort();
    
    // Tạo chuỗi signData bằng URLSearchParams để đảm bảo chuẩn hóa ký tự
    const signData = new URLSearchParams();
    sortedKeys.forEach((key) => {
      signData.append(key, vnp_Params[key].toString());
    });

    // 3. TẠO CHỮ KÝ HMAC-SHA512
    const hmac = crypto.createHmac("sha512", secretKey);
    // Lưu ý: VNPay yêu cầu chuỗi ký KHÔNG được encode các ký tự đặc biệt như dấu cách, dấu hai chấm...
    // Nhưng URLSearchParams.toString() lại encode. Ta cần giải mã ngược lại cho bước ký.
    const rawSignData = decodeURIComponent(signData.toString());
    
    const signed = hmac.update(Buffer.from(rawSignData, 'utf-8')).digest("hex");

    // 4. TẠO URL CUỐI CÙNG (Bước này mới cần encode)
    const finalUrl = `${vnpUrl}?${signData.toString()}&vnp_SecureHash=${signed}`;

    return NextResponse.json({ url: finalUrl });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}




