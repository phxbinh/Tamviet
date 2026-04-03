import { useState, useEffect } from 'react';

export const useClientInfo = () => {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
/*
    const fetchInfo = async () => {
      try {
        // 1. Lấy thông tin Browser/OS
        const ua = navigator.userAgent;
        
        // 2. Lấy vị trí qua IP (Thầm lặng - Không cần xin phép)
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();

        setInfo({
          browser: ua,
          ip: ipData.ip,
          city: ipData.city,
          region: ipData.region,
          country: ipData.country_name,
          isp: ipData.org, // Nhà mạng
          device: /Mobile|Android|iPhone/i.test(ua) ? 'Mobile' : 'Desktop'
        });
      } catch (error) {
        console.error("Lỗi lấy thông tin:", error);
      } finally {
        setLoading(false);
      }
    };
*/

// Sửa lại đoạn fetch trong useEffect của Hook:
const fetchInfo = async () => {
  try {
    // Thêm timeout để không đợi quá lâu nếu mạng lỗi
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);

    const ipRes = await fetch('http://ip-api.com/json/?fields=66846719', {
      signal: controller.signal
    });
    
    const ipData = await ipRes.json();
    clearTimeout(id);

    if (ipData.status === 'success') {
      setInfo({
        ip: ipData.query,
        city: ipData.city,
        region: ipData.regionName,
        country: ipData.country,
        isp: ipData.isp,
        lat: ipData.lat,
        lon: ipData.lon,
        browser: navigator.userAgent,
        device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
      });
    } else {
      throw new Error("Provider không trả về dữ liệu");
    }
  } catch (error) {
    console.error("Lỗi lấy thông tin:", error);
    // Fallback: Chỉ lấy User Agent nếu IP API chết
    setInfo({
      browser: navigator.userAgent,
      ip: 'Không xác định',
      city: 'N/A'
    });
  } finally {
    setLoading(false);
  }
};






    fetchInfo();
  }, []);

  return { info, loading };
};
