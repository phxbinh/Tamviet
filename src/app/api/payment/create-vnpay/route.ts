import { NextResponse } from 'next/server';
import crypto from 'crypto';
import moment from 'moment';
import qs from 'qs';

export async function POST(req: Request) {
  try {
    const { orderId, amount, orderInfo } = await req.json();

    // 1. Cấu hình thông tin
    const tmnCode = process.env.NEXT_PUBLIC_VNP_TMN_CODE!;
    const secretKey = process.env.VNP_HASH_SECRET!;
    const vnpUrl = process.env.VNP_URL!;
    const returnUrl = process.env.VNP_RETURN_URL!;

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const ipAddr = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 2. Tạo danh sách tham số
    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId, // Phải là duy nhất cho mỗi lần thanh toán
      vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay dùng đơn vị xu
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // 3. Sắp xếp tham số theo alphabet (Bắt buộc)
    vnp_Params = Object.keys(vnp_Params)
      .sort()
      .reduce((obj: any, key) => {
        obj[key] = vnp_Params[key];
        return obj;
      }, {});

    // 4. Tạo chữ ký Secure Hash
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    
    vnp_Params['vnp_SecureHash'] = signed;

    // 5. Build URL cuối cùng
    const paymentUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error("VNPAY_CREATE_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
