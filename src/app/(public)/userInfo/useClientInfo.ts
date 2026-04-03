'use server'
import { headers } from 'next/headers';

export async function getClientData() {
  const headerList = await headers();
  
  // Vercel tự cung cấp các header này, cực kỳ chính xác
  const ip = headerList.get('x-forwarded-for') || 'Unknown';
  const city = headerList.get('x-vercel-ip-city') || 'Hồ Chí Minh';
  const country = headerList.get('x-vercel-ip-country') || 'VN';
  const ua = headerList.get('user-agent') || 'Unknown';

  return { ip, city, country, ua };
}
