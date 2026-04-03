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
    // Sử dụng ipwho.is vì nó hỗ trợ HTTPS và CORS rất tốt
    const res = await fetch('https://ipwho.is/');
    const data = await res.json();

    if (data.success) {
      setInfo({
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country,
        isp: data.connection.isp,
        browser: navigator.userAgent,
        device: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
      });
    } else {
      console.error("API trả về success: false", data.message);
    }
  } catch (error) {
    console.error("Lỗi kết nối API:", error);
    // Fallback nếu API vẫn bị chặn (thường do Adblock hoặc DNS chặn)
    setInfo({
      ip: "Không xác định",
      city: "Vui lòng tắt Adblock",
      browser: navigator.userAgent,
      device: "Mobile"
    });
  } finally {
    setLoading(false);
  }
};







    fetchInfo();
  }, []);

  return { info, loading };
};
