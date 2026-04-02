import { z } from "zod";

export const ShippingAddressSchema = z.object({
  order_id: z.string(),
  // Liên hệ
  full_name: z.string().min(2, "Họ tên quá ngắn"),
  phone: z.string().regex(/(0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ"),
  email: z.string().email().optional().or(z.literal("")),

  // Địa chỉ chi tiết
  address_line1: z.string().min(5, "Địa chỉ cụ thể quá ngắn"),
  address_line2: z.string().optional(),

  // Địa giới (Bắt buộc để khớp với bảng mới)
  province_name: z.string(),
  district_name: z.string(),
  ward_name: z.string(),
  
  province_id: z.number(),
  district_id: z.number(),
  ward_code: z.string(), // GHN/GHTK thường dùng string cho ward

  country: z.string().default("Vietnam"),
  postal_code: z.string().optional(),
});

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;



// Dùng cái bên dưới ----------------------
export const CheckoutSchema = z.object({
  order_id: z.string(),
  full_name: z.string().min(2, "Họ tên quá ngắn"),
  phone: z.string().regex(/(0[3|5|7|8|9])+([0-9]{8})\b/, "SĐT không hợp lệ"),
  email: z.string().email().optional().or(z.literal("")),
  address_line1: z.string().min(5, "Địa chỉ quá ngắn"),
  province_id: z.number().positive("Chưa chọn Tỉnh"),
  province_name: z.string(),
  district_id: z.number().positive("Chưa chọn Quận"),
  district_name: z.string(),
  ward_code: z.string().min(1, "Chưa chọn Phường"),
  ward_name: z.string(),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;

