'use client';

import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

const WastewaterDiagram: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- CẤU HÌNH CANVAS CHUẨN ĐỘ PHÂN GIẢI CAO ---
    canvas.width = 1100;
    canvas.height = 400;
    
    // Nền trắng, nét vẽ màu đen tinh tế giống sách giáo khoa
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 1.8;
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';

    // --- CÁC HÀM TRỢ GIÚP VẼ (HELPERS) ---

    // 1. Hàm vẽ mũi tên thẳng chuẩn xác
    const drawArrow = (x1: number, y1: number, x2: number, y2: number): void => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 9 * Math.cos(angle - Math.PI / 6), y2 - 9 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - 9 * Math.cos(angle + Math.PI / 6), y2 - 9 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = '#000000';
      ctx.fill();
    };

    // 2. Hàm vẽ đường ống gấp khúc có mũi tên ở điểm cuối
    const drawPolylineArrow = (points: Point[]): void => {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      const p2 = points[points.length - 1];
      const p1 = points[points.length - 2];
      drawArrow(p1.x, p1.y, p2.x, p2.y);
    };

    // 3. Hàm vẽ ký hiệu mực nước (Tam giác ngược + 3 gạch giảm dần)
    const drawWaterLevel = (x: number, y: number): void => {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 5, y - 6);
      ctx.lineTo(x + 5, y - 6);
      ctx.closePath();
      ctx.fill();

      // 3 dấu gạch ngang bên dưới
      ctx.beginPath();
      ctx.moveTo(x - 6, y + 2); ctx.lineTo(x + 6, y + 2);
      ctx.moveTo(x - 4, y + 5); ctx.lineTo(x + 4, y + 5);
      ctx.moveTo(x - 2, y + 8); ctx.lineTo(x + 2, y + 8);
      ctx.stroke();
    };

    // 4. Hàm vẽ Bể Lắng (Clarifier) hình phễu chuẩn xác như ảnh gốc
    const drawClarifier = (x: number, y: number, width: number, height: number, title: string): void => {
      const straightH = height * 0.35; // Đoạn thành bể thẳng đứng

      // Đổ bóng gradient xám nhẹ tạo độ sâu cho nước lắng chìm
      const gradient = ctx.createLinearGradient(x, y, x, y + height);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.3, '#f9f9f9');
      gradient.addColorStop(1, '#cccccc');
      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width, y + straightH);
      ctx.lineTo(x + width / 2, y + height); // Đáy hình phễu thu bùn
      ctx.lineTo(x, y + straightH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gờ bể nhô ra hai bên thành
      ctx.beginPath();
      ctx.moveTo(x - 6, y); ctx.lineTo(x, y);
      ctx.moveTo(x + width, y); ctx.lineTo(x + width + 6, y);
      ctx.stroke();

      // Ký hiệu mực nước bên trong bể lắng
      drawWaterLevel(x + width * 0.75, y);

      // Ghi nhãn tên bể (Tự động căn giữa theo chiều ngang bồn)
      ctx.fillStyle = '#000000';
      ctx.font = '13px Arial';
      const words = title.split(' ');
      if (words.length > 1) {
        ctx.fillText(words[0], x + width / 2 - ctx.measureText(words[0]).width / 2, y - 22);
        ctx.fillText(words[1], x + width / 2 - ctx.measureText(words[1]).width / 2, y - 7);
      } else {
        ctx.fillText(title, x + width / 2 - ctx.measureText(title).width / 2, y - 10);
      }
    };

    // --- THIẾT LẬP TRỤC VÀ TỌA ĐỘ HỆ THỐNG ---
    const yMain = 170; // Trục dòng chảy chính nối giữa các bể

    // ==========================================
    // 1. PRIMARY CLARIFIER (BỂ LẮNG ĐỢT 1)
    // ==========================================
    drawClarifier(90, yMain, 80, 85, 'Primary clarifier');
    drawArrow(20, yMain + 25, 90, yMain + 25); // Dòng Thải Vào (Influent)
    ctx.font = 'bold 13px Arial';
    ctx.fillText('Influent', 25, yMain + 15);

    // Đường xả bùn đáy (Sludge)
    drawArrow(130, yMain + 85, 130, yMain + 145);
    ctx.font = '13px Arial';
    ctx.fillText('Sludge', 110, yMain + 162);


    // ==========================================
    // 2. NITRIFICATION TANK (BỂ HIẾU KHÍ - NITRAT HÓA)
    // ==========================================
    const nitX = 265;
    const nitW = 140;
    const nitH = 75;

    // Vẽ vỏ bể với 2 tai gờ nhô cao ở góc thành
    ctx.beginPath();
    ctx.moveTo(nitX - 6, yMain); ctx.lineTo(nitX, yMain);
    ctx.lineTo(nitX, yMain + nitH);
    ctx.lineTo(nitX + nitW, yMain + nitH);
    ctx.lineTo(nitX + nitW, yMain);
    ctx.lineTo(nitX + nitW + 6, yMain);
    ctx.stroke();

    // Mực nước và ký hiệu mực nước
    drawWaterLevel(nitX + nitW * 0.8, yMain);

    // Vẽ ống sục khí (Air pipe chìm sâu xuống đáy rồi bẻ ngang sang phải)
    ctx.beginPath();
    ctx.moveTo(nitX + 15, yMain - 40);
    ctx.lineTo(nitX + 15, yMain + 63);
    ctx.lineTo(nitX + nitW - 15, yMain + 63);
    ctx.stroke();
    ctx.fillText('Air', nitX + 8, yMain - 47);

    // Lỗ chân ống khí mịn (Đường nét đứt dập dìu)
    ctx.save();
    ctx.strokeStyle = '#000000';
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(nitX + 18, yMain + 63);
    ctx.lineTo(nitX + nitW - 15, yMain + 63);
    ctx.stroke();
    ctx.restore();

    // Mũi tên elip xoáy nước lộn nhào liên tục (Biểu thị sục khí khuấy trộn mạnh)
    ctx.save();
    ctx.translate(nitX + 75, yMain + 38);
    ctx.scale(1.8, 1);
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 1.65, false); // Vòng xoáy hở một chút để vẽ đầu mũi tên
    ctx.stroke();
    // Đầu mũi tên xoáy nội bộ
    const endAngle = Math.PI * 1.65;
    const arrowX = 14 * Math.cos(endAngle);
    const arrowY = 14 * Math.sin(endAngle);
    ctx.restore();

    ctx.save();
    ctx.translate(nitX + 75, yMain + 38);
    drawArrow(arrowX * 1.8 - 1, arrowY - 2, arrowX * 1.8, arrowY);
    ctx.restore();

    ctx.fillText('Nitrification tank', nitX + 20, yMain + nitH + 18);


    // ==========================================
    // 3. NITRIFICATION CLARIFIER (BỂ LẮNG NITRAT HÓA)
    // ==========================================
    const nitClarX = 460;
    drawClarifier(nitClarX, yMain, 80, 85, 'Nitrification clarifier');

    // Các đường kết nối trung gian
    drawArrow(170, yMain + 25, nitX, yMain + 25); // Từ lắng 1 đi tới hiếu khí
    drawArrow(nitX + nitW, yMain + 25, nitClarX, yMain + 25); // Từ hiếu khí sang lắng 2

    // Đường xả bùn đáy của bể lắng nitrat hóa
    drawArrow(nitClarX + 40, yMain + 85, nitClarX + 40, yMain + 145);
    ctx.fillText('Sludge', nitClarX + 20, yMain + 162);


    // ==========================================
    // 4. DENITRIFICATION TANK (BỂ KHỬ NITRAT - THIẾU KHÍ + TÁI SỤC KHÍ)
    // ==========================================
    const denitX = 625;
    const denitW = 155; // Tổng chiều rộng bể kép
    const denitH = 75;
    const anoxicW = 105; // Phần ngăn thiếu khí có cánh khuấy cơ học

    // Vẽ vỏ bọc toàn bộ bể khử Nitrat
    ctx.beginPath();
    ctx.moveTo(denitX - 6, yMain); ctx.lineTo(denitX, yMain);
    ctx.lineTo(denitX, yMain + denitH);
    ctx.lineTo(denitX + denitW, yMain + denitH);
    ctx.lineTo(denitX + denitW, yMain);
    ctx.lineTo(denitX + denitW + 6, yMain);
    ctx.stroke();

    // Vách ngăn lửng lơ chia bể làm 2 ngăn (Anoxic và Re-aeration) giống ảnh gốc
    ctx.beginPath();
    ctx.moveTo(denitX + anoxicW, yMain + 15);
    ctx.lineTo(denitX + anoxicW, yMain + denitH);
    ctx.stroke();

    // --- NGĂN THIẾU KHÍ (ANOXIC ZONE) ---
    // Vẽ họa tiết sọc chéo biểu thị vùng đặc biệt khuấy trộn không cấp khí
    ctx.save();
    ctx.beginPath();
    ctx.rect(denitX, yMain, anoxicW, denitH);
    ctx.clip();
    ctx.strokeStyle = '#e2e2e2'; // Màu sọc mảnh tinh tế
    ctx.lineWidth = 1;
    for (let i = -50; i < anoxicW + denitH; i += 8) {
      ctx.moveTo(denitX + i, yMain);
      ctx.lineTo(denitX + i + denitH, yMain + denitH);
    }
    ctx.stroke();
    ctx.restore();

    // Vẽ trục khuấy cơ học (Mixer) trung tâm ngăn 1
    const mixerX = denitX + anoxicW / 2;
    ctx.beginPath();
    ctx.moveTo(mixerX, yMain - 20);
    ctx.lineTo(mixerX, yMain + 50);
    ctx.stroke();
    // Cánh khuấy (Hình elip xoay ngang dẹt ở đáy)
    ctx.beginPath();
    ctx.ellipse(mixerX, yMain + 50, 16, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Vòng mũi tên chỉ hướng quay của Mixer trên đầu trục
    ctx.save();
    ctx.translate(mixerX, yMain - 20);
    ctx.scale(1.5, 0.6);
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 1.7);
    ctx.stroke();
    drawArrow(8 * Math.cos(Math.PI * 1.7) - 1, 8 * Math.sin(Math.PI * 1.7) + 1, 8 * Math.cos(Math.PI * 1.7), 8 * Math.sin(Math.PI * 1.7));
    ctx.restore();
    ctx.fillText('Mixer', mixerX - 16, yMain - 32);
    drawWaterLevel(denitX + 20, yMain);

    // --- NGĂN TÁI SỤC KHÍ NHỎ (RE-AERATION ZONE) ---
    // Ống cấp khí phụ bổ sung
    const air2X = denitX + anoxicW + 16;
    ctx.beginPath();
    ctx.moveTo(air2X, yMain - 40);
    ctx.lineTo(air2X, yMain + 63);
    ctx.lineTo(denitX + denitW - 5, yMain + 63);
    ctx.stroke();
    ctx.fillText('Air', air2X - 7, yMain - 47);

    // Vẽ chùm bọt khí nổi sùng sục (Các vòng tròn nhỏ rải rác)
    const bubblePoints = [
      {x: air2X + 8, y: yMain + 30}, {x: air2X + 13, y: yMain + 45},
      {x: air2X + 5, y: yMain + 55}, {x: air2X + 22, y: yMain + 38},
      {x: air2X + 18, y: yMain + 52}, {x: air2X + 24, y: yMain + 25}
    ];
    bubblePoints.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.fillText('Denitrification tank', denitX + 10, yMain + denitH + 18);


    // ==========================================
    // ĐƯỜNG ỐNG DẪN TRUNG GIAN & CHÂM METHANOL
    // ==========================================
    // Nối từ Lắng Nitrat hóa sang bể khử Nitrat
    drawArrow(nitClarX + 80, yMain + 25, denitX, yMain + 25);
    
    // Ống châm hóa chất Methanol đâm thẳng từ trên xuống vuông góc đường ống chính
    const methanolX = nitClarX + 125;
    drawArrow(methanolX, yMain - 40, methanolX, yMain + 25);
    ctx.fillText('Methanol', methanolX - 26, yMain - 47);


    // ==========================================
    // 5. SECONDARY CLARIFIER (BỂ LẮNG ĐỢT 2 / LẮNG CUỐI)
    // ==========================================
    const secClarX = 840;
    drawClarifier(secClarX, yMain, 80, 85, 'Secondary clarifier');

    // Kết nối từ bể khử nitrat sang bể lắng cuối
    drawArrow(denitX + denitW, yMain + 25, secClarX, yMain + 25);

    // Dòng nước sạch đầu ra (Effluent) thoát khỏi hệ thống
    drawArrow(secClarX + 80, yMain + 25, secClarX + 150, yMain + 25);
    ctx.font = 'bold 13px Arial';
    ctx.fillText('Effluent', secClarX + 90, yMain + 15);

    // Đường xả bùn đáy bể lắng cuối
    drawArrow(secClarX + 40, yMain + 85, secClarX + 40, yMain + 145);
    ctx.font = '13px Arial';
    ctx.fillText('Sludge', secClarX + 20, yMain + 162);


    // ==========================================
    // ĐƯỜNG TUẦN HOÀN BÙN HOẠT TÍNH (RETURN ACTIVATED SLUDGE - RAS)
    // ==========================================
    ctx.font = '12px Arial';

    // Tuyến 1: Tuần hoàn bùn từ bể Lắng Nitrat hóa quay về đầu bể Hiếu khí
    drawPolylineArrow([
      { x: nitClarX + 40, y: yMain + 110 }, // Trích từ nhánh xả bùn
      { x: nitClarX + 40, y: yMain + 115 }, // Đi xuống thấp hơn
      { x: 170, y: yMain + 115 },          // Chạy ngược dòng về phía bên trái
      { x: 170, y: yMain + 25 }            // Đâm ngược lên hòa dòng vào ống nạp bể Hiếu khí
    ]);
    ctx.fillText('Return activated sludge', 215, yMain + 130);

    // Tuyến 2: Tuần hoàn bùn từ bể Lắng Cuối quay về đầu bể Khử Nitrat
    drawPolylineArrow([
      { x: secClarX + 40, y: yMain + 110 }, // Trích từ nhánh xả bùn cuối
      { x: secClarX + 40, y: yMain + 115 }, // Hạ xuống
      { x: 550, y: yMain + 115 },           // Chạy ngược về phía trước bể khử nitrat
      { x: 550, y: yMain + 25 }             // Đi lên hòa dòng ngay sau điểm châm Methanol
    ]);
    ctx.fillText('Return activated sludge', 595, yMain + 130);


    // Ký hiệu hình (c) ở góc trái dưới chuẩn xác
    ctx.font = '15px Arial';
    ctx.fillText('(c)', 30, 310);

  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '25px' }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          border: '1px solid #d3d3d3', 
          backgroundColor: '#ffffff', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          maxWidth: '100%',
          borderRadius: '4px'
        }}
      />
    </div>
  );
};

export default WastewaterDiagram;
