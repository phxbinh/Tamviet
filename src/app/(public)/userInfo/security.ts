import { createHash } from 'crypto';

/**
 * Tạo mã định danh ẩn danh (Anonymized Fingerprint)
 * Mã hóa một chiều SHA-256
 */
export function generateUserFingerprint(ip: string, ua: string) {
  // Chúng ta thêm một chuỗi "Salt" bí mật để tăng độ bảo mật
  // Kẻ xấu dù có IP cũng không thể đoán được Hash nếu không có Salt này
  const SALT = process.env.USER_FINGERPRINT_SALT || 'stoic-secret-2026';
  
  const rawData = `${ip}-${ua}-${SALT}`;
  
  return createHash('sha256')
    .update(rawData)
    .digest('hex'); // Trả về chuỗi ví dụ: a8e3f...
}

/**
 * Làm mờ tọa độ GPS (Chỉ giữ lại độ chính xác cấp phường/quận)
 * Giúp bạn ngủ ngon vì không lưu vị trí chính xác số nhà
 */
export function blurCoordinates(lat: number, lng: number) {
  return {
    lat: parseFloat(lat.toFixed(2)), // 10.762622 -> 10.76
    lng: parseFloat(lng.toFixed(2))  // 106.660172 -> 106.66
  };
}
