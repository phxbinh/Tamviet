'use server'
import { headers } from 'next/headers';

export async function getClientData() {
  const headerList = await headers();
  
  // Lấy IP: Vercel trả về chuỗi IP, đôi khi kèm port hoặc nhiều IP (proxy), ta lấy cái đầu tiên
  const forwarded = headerList.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'Unknown';

  // Lấy vị trí từ Vercel Edge
  const rawCity = headerList.get('x-vercel-ip-city') || 'Not found - City';
  const country = headerList.get('x-vercel-ip-country') || 'Not found - Country';
  
  // Fix lỗi %20 ngay tại đây để Client nhận data sạch
  const city = decodeURIComponent(rawCity).replace(/\+/g, ' ');

  // Thông tin thiết bị
  const ua = headerList.get('user-agent') || 'Unknown Device';

  return { 
    ip, 
    city, 
    country, 
    ua 
  };
}
