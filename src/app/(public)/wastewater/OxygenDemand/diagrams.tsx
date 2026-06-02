import React, { useEffect, useRef } from 'react';

const WastewaterDiagram = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cấu hình kích thước và màu sắc chuẩn
    canvas.width = 1100;
    canvas.height = 400;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '14px Arial';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    ctx.fillStyle = '#333';

    // --- HÀM VẼ TRỢ GIÚP (HELPERS) ---

    // Hàm vẽ mũi tên từ (x1, y1) đến (x2, y2)
    const drawArrow = (x1, y1, x2, y2) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Đầu mũi tên
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 8 * Math.cos(angle - Math.PI / 6), y2 - 8 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - 8 * Math.cos(angle + Math.PI / 6), y2 - 8 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    };

    // Hàm vẽ đường ống gấp khúc có mũi tên ở cuối
    const drawPolylineArrow = (points) => {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      // Vẽ mũi tên ở đoạn cuối cùng
      const p2 = points[points.length - 1];
      const p1 = points[points.length - 2];
      drawArrow(p1.x, p1.y, p2.x, p2.y);
    };

    // Hàm vẽ bể lắng (Clarifier) dạng hình phễu đáy
    const drawClarifier = (x, y, width, height, title) => {
      const topWidth = width;
      const straightHeight = height * 0.4;

      // Vẽ gradient nước trong bể
      const gradient = ctx.createLinearGradient(x, y, x, y + height);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, '#dcdcdc');
      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + topWidth, y);
      ctx.lineTo(x + topWidth, y + straightHeight);
      ctx.lineTo(x + topWidth / 2, y + height); // Đáy hình phễu
      ctx.lineTo(x, y + straightHeight);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Vẽ ký hiệu mực nước (tam giác nhỏ ngược)
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.moveTo(x + topWidth * 0.7, y);
      ctx.lineTo(x + topWidth * 0.7 - 5, y - 6);
      ctx.lineTo(x + topWidth * 0.7 + 5, y - 6);
      ctx.closePath();
      ctx.fill();

      // Vẽ gờ bể
      ctx.beginPath();
      ctx.moveTo(x - 5, y); ctx.lineTo(x, y);
      ctx.moveTo(x + topWidth, y); ctx.lineTo(x + topWidth + 5, y);
      ctx.stroke();

      // Tên bể
      ctx.fillText(title, x + topWidth / 2 - ctx.measureText(title).width / 2, y - 15);
    };

    // --- TIẾN HÀNH VẼ CÁC THÀNH PHẦN ---

    const yLevel = 150; // Trục ngang chính của dòng nước

    // 1. Primary Clarifier
    drawClarifier(100, yLevel, 80, 80, 'Primary clarifier');
    drawArrow(30, yLevel + 20, 100, yLevel + 20); // Influent
    ctx.fillText('Influent', 35, yLevel + 12);
    drawArrow(140, yLevel + 80, 140, yLevel + 130); // Sludge đáy
    ctx.fillText('Sludge', 120, yLevel + 145);

    // 2. Nitrification Tank
    const nitTankX = 260;
    ctx.strokeRect(nitTankX, yLevel, 120, 70);
    // Vẽ sục khí bên trong
    ctx.strokeStyle = '#999';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(nitTankX + 10, yLevel + 60);
    ctx.lineTo(nitTankX + 110, yLevel + 60);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#333';
    // Ống khí vào
    drawPolylineArrow([{ x: nitTankX + 25, y: yLevel - 40 }, { x: nitTankX + 25, y: yLevel + 60 }]);
    ctx.fillText('Air', nitTankX + 17, yLevel - 45);
    // Mũi tên xoáy nước tròn biểu thị trộn đều
    ctx.beginPath();
    ctx.arc(nitTankX + 65, yLevel + 35, 15, 0, Math.PI * 1.5);
    ctx.stroke();
    drawArrow(nitTankX + 80, yLevel + 35, nitTankX + 80, yLevel + 36);
    ctx.fillText('Nitrification tank', nitTankX - 5, yLevel + 85);

    // 3. Nitrification Clarifier
    drawClarifier(450, yLevel, 80, 80, 'Nitrification clarifier');
    drawArrow(180, yLevel + 20, nitTankX, yLevel + 20); // Dòng vào NitTank
    drawArrow(nitTankX + 120, yLevel + 30, 450, yLevel + 30); // Từ NitTank sang Clarifier
    drawArrow(490, yLevel + 80, 490, yLevel + 130); // Sludge đáy
    ctx.fillText('Sludge', 470, yLevel + 145);

    // 4. Denitrification Tank
    const denitTankX = 610;
    // Phần sọc chéo (Anoxic/Mixer)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(denitTankX, yLevel, 90, 70);
    ctx.strokeRect(denitTankX, yLevel, 90, 70);
    // Vẽ mixer
    ctx.beginPath();
    ctx.moveTo(denitTankX + 45, yLevel - 20);
    ctx.lineTo(denitTankX + 45, yLevel + 45);
    ctx.stroke();
    ctx.beginPath(); // Cánh khuấy
    ctx.ellipse(denitTankX + 45, yLevel + 45, 15, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Mũi tên xoay mixer
    ctx.beginPath(); ctx.arc(denitTankX + 45, yLevel - 20, 10, 0, Math.PI * 1.5); ctx.stroke();
    ctx.fillText('Mixer', denitTankX + 25, yLevel - 30);

    // Phần sục khí nhỏ phía sau Denit tank (Re-aeration)
    ctx.strokeRect(denitTankX + 90, yLevel, 30, 70);
    drawPolylineArrow([{ x: denitTankX + 105, y: yLevel - 40 }, { x: denitTankX + 105, y: yLevel + 60 }]);
    ctx.fillText('Air', denitTankX + 100, yLevel - 45);

    ctx.fillText('Denitrification tank', denitTankX - 10, yLevel + 85);

    // Dòng nối từ Nit Clarifier sang Denit Tank kèm châm Methanol
    drawArrow(530, yLevel + 30, denitTankX, yLevel + 30);
    drawArrow(580, yLevel - 30, 580, yLevel + 30);
    ctx.fillText('Methanol', 555, yLevel - 35);

    // 5. Secondary Clarifier
    drawClarifier(790, yLevel, 80, 80, 'Secondary clarifier');
    drawArrow(denitTankX + 120, yLevel + 30, 790, yLevel + 30);
    drawArrow(870, yLevel + 20, 950, yLevel + 20); // Effluent
    ctx.fillText('Effluent', 905, yLevel + 12);
    drawArrow(830, yLevel + 80, 830, yLevel + 130); // Sludge đáy
    ctx.fillText('Sludge', 810, yLevel + 145);

    // --- VẼ ĐƯỜNG TUẦN HOÀN BÙN (RETURN ACTIVATED SLUDGE) ---

    // 1. RAS từ Nitrification Clarifier quay lại trước Nitrification Tank
    drawPolylineArrow([
      { x: 490, y: yLevel + 100 },
      { x: 490, y: yLevel + 115 },
      { x: 210, y: yLevel + 115 },
      { x: 210, y: yLevel + 20 }
    ]);
    ctx.fillText('Return activated sludge', 245, yLevel + 130);

    // 2. RAS từ Secondary Clarifier quay lại trước Denitrification Tank
    drawPolylineArrow([
      { x: 830, y: yLevel + 100 },
      { x: 830, y: yLevel + 115 },
      { x: 560, y: yLevel + 115 },
      { x: 560, y: yLevel + 30 }
    ]);
    ctx.fillText('Return activated sludge', 600, yLevel + 130);

    // Ký hiệu hình (c) ở góc dưới
    ctx.font = 'bold 16px Arial';
    ctx.fillText('(c)', 30, 320);

  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
      <canvas 
        ref={canvasRef} 
        style={{ border: '1px solid #ccc', backgroundColor: '#fff', maxWidth: '100%' }}
      />
    </div>
  );
};

export default WastewaterDiagram;
