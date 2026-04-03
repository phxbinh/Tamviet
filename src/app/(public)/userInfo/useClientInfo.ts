import { useState, useEffect } from 'react';

export const useClientInfo = () => {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchInfo();
  }, []);

  return { info, loading };
};
