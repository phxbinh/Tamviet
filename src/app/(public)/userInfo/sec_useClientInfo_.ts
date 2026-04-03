'use server'
import { headers } from 'next/headers';
import { generateUserFingerprint } from './security';

export async function getClientData() {
  const headerList = await headers();
  
  const forwarded = headerList.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'Unknown';
  const ua = headerList.get('user-agent') || 'Unknown';

  // Tạo ID ẩn danh thay vì lưu IP thật
  const userFingerprint = generateUserFingerprint(ip, ua);

  return { 
    fingerprint: userFingerprint,
    city: decodeURIComponent(headerList.get('x-vercel-ip-city') || 'VN'),
    country: headerList.get('x-vercel-ip-country') || 'VN',
  };
}
