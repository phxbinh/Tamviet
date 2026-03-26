/**
 * Format số thành định dạng tiền tệ Việt Nam (VNĐ)
 * Ví dụ: 454500 -> 454.500₫
 */
export const formatCurrency = (price: number | string | null | undefined): string => {
  if (!price) return "Liên hệ"; // Trường hợp chưa có giá trong database

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    // Nếu bạn muốn bỏ chữ "VND" thay bằng "₫" cho sang:
    currencyDisplay: 'symbol', 
  }).format(numericPrice);
};
