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

console.log({
  orderId,
  signData,
  finalUrl
});



    return NextResponse.json({ url: finalUrl });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/*
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import moment from 'moment';

export async function POST(req: Request) {
  try {
    const { orderId, totalPrice } = await req.json();

    const secretKey = process.env.VNP_HASH_SECRET!.trim();
    const vnpUrl = process.env.VNP_URL!;
    const tmnCode = process.env.NEXT_PUBLIC_VNP_TMN_CODE!;
    const returnUrl = process.env.VNP_RETURN_URL!;

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    const ipAddr =
      req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
//vnp_IpAddr: '127.0.0.1',

    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: 'Thanh_toan_cho_ma_don_hang_' + orderId,
      vnp_OrderType: 'other',
      vnp_Amount: Number(totalPrice) * 100, // fix nhẹ tránh lỗi float/string
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    // 1. Sắp xếp các tham số theo alphabet
    const sortedKeys = Object.keys(vnp_Params).sort();

    // 2. Tạo chuỗi dữ liệu để ký (KHÔNG encode)
    const signData = sortedKeys
      .map((key) => `${key}=${vnp_Params[key]}`)
      .join('&');

    // 3. Tạo chuỗi query để nối vào URL (CÓ encode)
    const queryData = sortedKeys
      .map(
        (key) =>
          `${key}=${encodeURIComponent(vnp_Params[key]).replace(/%20/g, '+')}`
      )
      .join('&');

    // 4. Thực hiện băm HMAC-SHA512
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(signData, 'utf-8').digest('hex');

    // 5. Build URL cuối cùng
    const finalUrl = `${vnpUrl}?${queryData}&vnp_SecureHash=${signed}`;

    return NextResponse.json({ url: finalUrl });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
*/






// app/api/payment/create/route.ts  (hoặc đường dẫn bạn đang dùng)

// src/app/api/payment/create-vnpay/route.ts
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

    let vnp_Params: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan cho ma don hang: ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Amount: Math.round(Number(totalPrice)) * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // Sắp xếp keys
    const sortedKeys = Object.keys(vnp_Params).sort();

    // ==================== TẠO SIGNDATA (KHÔNG ENCODE) ====================
    const signData = sortedKeys
      .map((key) => `${key}=${vnp_Params[key]}`)
      .join('&');

    // Tạo hash
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Thêm SecureHash vào params
    vnp_Params['vnp_SecureHash'] = signed;

    // ==================== TẠO QUERY STRING CHO URL (CÓ ENCODE) ====================
    const finalSortedKeys = [...sortedKeys, 'vnp_SecureHash'].sort();

    const queryData = finalSortedKeys
      .map((key) => {
        const value = String(vnp_Params[key]);
        return `${key}=${encodeURIComponent(value).replace(/%20/g, '+')}`;
      })
      .join('&');

    const finalUrl = `${vnpUrl}?${queryData}`;

    console.log('=== VNPAY CREATE PAYMENT ===');
    console.log('SignData:', signData);
    console.log('SecureHash:', signed);
    // console.log('Final URL:', finalUrl); // Uncomment nếu cần xem full URL

    return NextResponse.json({ url: finalUrl });
  } catch (error) {
    console.error('Create VNPay Payment Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

*/


