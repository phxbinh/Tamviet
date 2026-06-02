'use client';

import React, { useState, useEffect, useRef } from 'react';

type TankType = 'primary_clarifier' | 'denitrification_tank' | 'nitrification_tank' | 'secondary_clarifier';

interface TankItem {
  id: string;
  type: TankType;
  label: string;
}

const DynamicWastewaterDiagram: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Khởi tạo quy trình chuẩn: Lắng 1 -> Anoxic (Khử Nitrat) -> Aeration (Hiếu khí) -> Lắng 2
  const [tanks, setTanks] = useState<TankItem[]>([
    { id: '1', type: 'primary_clarifier', label: 'Primary clarifier' },
    { id: '2', type: 'denitrification_tank', label: 'Anoxic tank' },
    { id: '3', type: 'nitrification_tank', label: 'Aeration tank' },
    { id: '4', type: 'secondary_clarifier', label: 'Secondary clarifier' }
  ]);
  
  const [selectedType, setSelectedType] = useState<TankType>('secondary_clarifier');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tankSpacing = 200; // Khoảng cách giữa các tâm bồn nới rộng để dễ nhìn
    const startX = 60;
    const yMain = 140;
    const tankW = 100;
    const tankH = 80;
    
    canvas.width = Math.max(1000, startX + tanks.length * tankSpacing + 120);
    canvas.height = 380;

    // Reset canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 1.8;

    // --- HÀM VẼ MŨI TÊN ---
    const drawArrow = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 8 * Math.cos(angle - Math.PI / 6), y2 - 8 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - 8 * Math.cos(angle + Math.PI / 6), y2 - 8 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    };

    // --- HÀM VẼ ĐƯỜNG ỐNG GẤP KHÚC CÓ MŨI TÊN ---
    const drawPolylineArrow = (points: {x: number, y: number}[]) => {
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

    // --- VÒNG LẶP VẼ CÁC BỒN CÔNG NGHỆ ---
    tanks.forEach((tank, index) => {
      const currentX = startX + index * tankSpacing;

      // Mũi tên vào bồn đầu tiên
      if (index === 0) {
        drawArrow(currentX - 45, yMain + 25, currentX, yMain + 25);
        ctx.font = '12px Arial';
        ctx.fillText('Influent', currentX - 45, yMain + 13);
      }

      // Phân biệt biên dạng bồn để vẽ
      if (tank.type.includes('clarifier')) {
        // Vẽ bồn lắng hình phễu
        ctx.beginPath();
        ctx.moveTo(currentX, yMain);
        ctx.lineTo(currentX + tankW, yMain);
        ctx.lineTo(currentX + tankW, yMain + 30);
        ctx.lineTo(currentX + tankW / 2, yMain + tankH);
        ctx.lineTo(currentX, yMain + 30);
        ctx.closePath();
        ctx.stroke();
        
        // Ống xả bùn dư xuống đáy bồn lắng
        drawArrow(currentX + tankW / 2, yMain + tankH, currentX + tankW / 2, yMain + tankH + 35);
        ctx.font = '11px Arial';
        ctx.fillText('Sludge', currentX + tankW / 2 - 16, yMain + tankH + 48);
      } else {
        // Vẽ bồn phản ứng sinh học (Chữ nhật)
        ctx.strokeRect(currentX, yMain, tankW, tankH);

        // Đồ họa trực quan đặc trưng cho từng loại bồn sinh học
        if (tank.type === 'denitrification_tank') {
          // Bể Anoxic: Có cánh khuấy trộn (Mixer)
          const mixerX = currentX + tankW / 2;
          ctx.beginPath();
          ctx.moveTo(mixerX, yMain - 15); ctx.lineTo(mixerX, yMain + 55);
          ctx.moveTo(mixerX - 10, yMain + 55); ctx.lineTo(mixerX + 10, yMain + 55);
          ctx.stroke();
          ctx.font = '10px Arial';
          ctx.fillText('M', mixerX - 4, yMain - 18);
        } else if (tank.type === 'nitrification_tank') {
          // Bể Aeration: Hệ thống đĩa thổi khí dưới đáy bồn (Nét đứt)
          ctx.save();
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(currentX + 10, yMain + tankH - 10);
          ctx.lineTo(currentX + tankW - 10, yMain + tankH - 10);
          ctx.stroke();
          ctx.restore();
          ctx.font = '11px Arial';
          ctx.fillText('Air', currentX + 10, yMain - 10);
          drawArrow(currentX + 18, yMain - 5, currentX + 18, yMain + tankH - 15);
        }
      }

      // In tên nhãn nằm trên bồn
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.fillText(tank.label, currentX + tankW / 2 - ctx.measureText(tank.label).width / 2, yMain - 5);

      // Đường ống nối thẳng giữa các bồn kế tiếp
      if (index < tanks.length - 1) {
        const nextX = startX + (index + 1) * tankSpacing;
        drawArrow(currentX + tankW, yMain + 25, nextX, yMain + 25);
      } else {
        // Mũi tên bồn cuối cùng
        drawArrow(currentX + tankW, yMain + 25, currentX + tankW + 50, yMain + 25);
        ctx.font = '12px Arial';
        ctx.fillText('Effluent', currentX + tankW + 5, yMain + 13);
      }
    });

    // =========================================================================
    // THUẬT TOÁN TỰ ĐỘNG TÌM KIẾM VÀ VẼ CÁC ĐƯỜNG TUẦN HOÀN DỰA TRÊN DỮ LIỆU
    // =========================================================================

    // Tìm index của các bể quan trọng trong chuỗi
    const anoxicIdx = tanks.findIndex(t => t.type === 'denitrification_tank');
    const aerationIdx = tanks.findIndex(t => t.type === 'nitrification_tank');
    //const secondaryClarifierIdx = tanks.findLastIndex(t => t.type === 'secondary_clarifier');

// THAY BẰNG ĐOẠN NÀY:
let secondaryClarifierIdx = -1;
for (let i = tanks.length - 1; i >= 0; i--) {
  if (tanks[i].type === 'secondary_clarifier') {
    secondaryClarifierIdx = i;
    break;
  }
}



    // 1. TUẦN HOÀN BÙN (RAS): Từ bể lắng bậc hai về bể Anoxic (Chạy ngầm ở ĐÁY)
    if (secondaryClarifierIdx !== -1 && anoxicIdx !== -1 && secondaryClarifierIdx > anoxicIdx) {
      const startRAS_X = startX + secondaryClarifierIdx * tankSpacing + tankW / 2;
      const endRAS_X = startX + anoxicIdx * tankSpacing - 25; // Đổ vào ngay trước ống dẫn vào bể Anoxic

      drawPolylineArrow([
        { x: startRAS_X, y: yMain + tankH + 20 },      // Điểm trích từ ống xả bùn đáy bể lắng 2
        { x: startRAS_X, y: yMain + tankH + 60 },      // Hạ thấp hẳn xuống làn dưới cùng
        { x: endRAS_X, y: yMain + tankH + 60 },        // Chạy ngược dòng sang trái
        { x: endRAS_X, y: yMain + 25 }                 // Đi thẳng lên trên để hòa trộn vào dòng chính đầu bể Anoxic
      ]);
      ctx.font = '11px Arial';
      ctx.fillText('Return Activated Sludge (RAS)', endRAS_X + 20, yMain + tankH + 53);
    }

    // 2. TUẦN HOÀN NƯỚC NỘI BỘ (Internal Nitrification Recycle): Từ Aeration về Anoxic (Chạy phía TRÊN)
    if (aerationIdx !== -1 && anoxicIdx !== -1 && aerationIdx > anoxicIdx) {
      const startRecycleX = startX + aerationIdx * tankSpacing + tankW - 20; // Trích cuối bồn hiếu khí
      const endRecycleX = startX + anoxicIdx * tankSpacing + 15;            // Trả về đầu bồn thiếu khí

      drawPolylineArrow([
        { x: startRecycleX, y: yMain },               // Điểm hút từ đỉnh mực nước bể Aeration
        { x: startRecycleX, y: yMain - 40 },          // Đẩy ngược vọt lên phía trên cao
        { x: endRecycleX, y: yMain - 40 },            // Chạy ngang ngược về phía bên trái
        { x: endRecycleX, y: yMain }                  // Đâm trực diện xuống lòng bể Anoxic
      ]);
      ctx.font = '11px Arial';
      ctx.fillText('Internal Recycle (Nitrate)', endRecycleX + 15, yMain - 45);
    }

  }, [tanks]);

  // Điều khiển cập nhật mảng
  const handleAddTank = () => {
    const labels: Record<TankType, string> = {
      primary_clarifier: 'Primary clarifier',
      denitrification_tank: 'Anoxic tank',
      nitrification_tank: 'Aeration tank',
      secondary_clarifier: 'Secondary clarifier',
    };
    const newTank: TankItem = {
      id: Date.now().toString(),
      type: selectedType,
      label: labels[selectedType]
    };
    setTanks([...tanks, newTank]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h3>Sơ đồ động: Tuần hoàn bùn (RAS) & Tuần hoàn nội bộ (Internal Recycle)</h3>
      
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value as TankType)}>
          <option value="denitrification_tank">Anoxic Tank (Bể khử Nitrat)</option>
          <option value="nitrification_tank">Aeration Tank (Bể hiếu khí)</option>
          <option value="secondary_clarifier">Secondary Clarifier (Bể lắng 2)</option>
        </select>
        <button onClick={handleAddTank} style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
          Thêm hạng mục
        </button>
        <button onClick={() => setTanks([{ id: '1', type: 'primary_clarifier', label: 'Primary clarifier' }])} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
          Xóa hết
        </button>
      </div>

      <div style={{ width: '100%', overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
        <canvas ref={canvasRef} style={{ display: 'block' }} />
      </div>
    </div>
  );
};

export default DynamicWastewaterDiagram;
