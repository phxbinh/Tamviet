'use client';

import React, { useState, useEffect, useRef } from 'react';

// 1. Định nghĩa các kiểu bể dữ liệu
type TankType = 'primary_clarifier' | 'nitrification_tank' | 'nitrification_clarifier' | 'denitrification_tank' | 'secondary_clarifier';

interface TankItem {
  id: string;
  type: TankType;
  label: string;
}

const DynamicWastewaterDiagram: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // 2. State quản lý danh sách các bể hiện có trên sơ đồ
  const [tanks, setTanks] = useState<TankItem[]>([
    { id: '1', type: 'primary_clarifier', label: 'Primary clarifier' },
    { id: '2', type: 'nitrification_tank', label: 'Nitrification tank' }
  ]);
  
  // State phục vụ việc chọn bể để thêm
  const [selectedType, setSelectedType] = useState<TankType>('nitrification_clarifier');

  // 3. Hàm vẽ lại Canvas mỗi khi mảng `tanks` thay đổi
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cấu hình kích thước động dựa trên số lượng bồn (mỗi bồn cần khoảng 180px chiều rộng)
    const tankSpacing = 180; 
    const startX = 50;
    const yMain = 150;
    
    canvas.width = Math.max(1000, startX + tanks.length * tankSpacing + 100);
    canvas.height = 350;

    // Reset nền canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 2;

    // --- HÀM VẼ MŨI TÊN TRỢ GIÚP ---
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

    // --- VÒNG LẶP DUYỆT MẢNG DỮ LIỆU ĐỂ VẼ DỰA TRÊN CHỈ SỐ (INDEX) ---
    tanks.forEach((tank, index) => {
      // Tọa độ X của bể hiện tại phụ thuộc hoàn toàn vào index của nó trong mảng
      const currentX = startX + index * tankSpacing; 
      const tankW = 90;
      const tankH = 80;

      // Vẽ mũi tên nạp liệu ban đầu cho bể đầu tiên
      if (index === 0) {
        drawArrow(currentX - 40, yMain + 25, currentX, yMain + 25);
        ctx.font = '12px Arial';
        ctx.fillText('Influent', currentX - 40, yMain + 15);
      }

      // Nhận diện loại bể để vẽ hình dáng tương ứng
      if (tank.type.includes('clarifier')) {
        // Vẽ Bể Lắng (Hình phễu)
        ctx.beginPath();
        ctx.moveTo(currentX, yMain);
        ctx.lineTo(currentX + tankW, yMain);
        ctx.lineTo(currentX + tankW, yMain + 30);
        ctx.lineTo(currentX + tankW / 2, yMain + tankH);
        ctx.lineTo(currentX, yMain + 30);
        ctx.closePath();
        ctx.stroke();
        
        // Đường xả bùn đáy cho mỗi bể lắng
        drawArrow(currentX + tankW / 2, yMain + tankH, currentX + tankW / 2, yMain + tankH + 40);
        ctx.font = '11px Arial';
        ctx.fillText('Sludge', currentX + tankW / 2 - 15, yMain + tankH + 52);
      } else {
        // Vẽ Bể Phản Ứng (Hình chữ nhật)
        ctx.strokeRect(currentX, yMain, tankW, tankH);
        
        // Nếu là bể hiếu khí, vẽ thêm ký hiệu ống khí đơn giản
        if (tank.type === 'nitrification_tank') {
          ctx.beginPath();
          ctx.moveTo(currentX + 15, yMain - 20);
          ctx.lineTo(currentX + 15, yMain + tankH - 10);
          ctx.lineTo(currentX + tankW - 15, yMain + tankH - 10);
          ctx.stroke();
          ctx.font = '11px Arial';
          ctx.fillText('Air', currentX + 10, yMain - 25);
        }
      }

      // Ghi nhãn tên bể (Cắt chuỗi viết xuống 2 dòng nếu quá dài)
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      const words = tank.label.split(' ');
      if (words.length > 1) {
        ctx.fillText(words[0], currentX + tankW/2 - ctx.measureText(words[0]).width/2, yMain - 20);
        ctx.fillText(words[1], currentX + tankW/2 - ctx.measureText(words[1]).width/2, yMain - 5);
      } else {
        ctx.fillText(tank.label, currentX + tankW/2 - ctx.measureText(tank.label).width/2, yMain - 10);
      }

      // VẼ MŨI TÊN NỐI TIẾP: Nếu chưa phải bể cuối cùng, tự động vẽ mũi tên nối sang bể tiếp theo
      if (index < tanks.length - 1) {
        const nextX = startX + (index + 1) * tankSpacing;
        drawArrow(currentX + tankW, yMain + 25, nextX, yMain + 25);
      } else {
        // Nếu là bể cuối cùng, vẽ mũi tên đầu ra (Effluent)
        drawArrow(currentX + tankW, yMain + 25, currentX + tankW + 50, yMain + 25);
        ctx.font = '12px Arial';
        ctx.fillText('Effluent', currentX + tankW + 5, yMain + 15);
      }
    });

  }, [tanks]);

  // 4. Hàm xử lý logic khi bấm nút "Thêm hạng mục"
  const handleAddTank = () => {
    const labels: Record<TankType, string> = {
      primary_clarifier: 'Primary clarifier',
      nitrification_tank: 'Nitrification tank',
      nitrification_clarifier: 'Nitrification clarifier',
      denitrification_tank: 'Denitrification tank',
      secondary_clarifier: 'Secondary clarifier',
    };

    const newTank: TankItem = {
      id: Date.now().toString(),
      type: selectedType,
      label: labels[selectedType]
    };

    setTanks([...tanks, newTank]);
  };

  // 5. Hàm reset sơ đồ
  const handleReset = () => {
    setTanks([{ id: '1', type: 'primary_clarifier', label: 'Primary clarifier' }]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h3>Sơ Đồ Công Nghệ Xử Lý Nước Thải Tự Động Nối Dài</h3>
      
      {/* Khu vực điều khiển của Client */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label>Chọn hạng mục tiếp theo: </label>
        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value as TankType)}
          style={{ padding: '6px', borderRadius: '4px' }}
        >
          <option value="primary_clarifier">Primary Clarifier (Bể lắng 1)</option>
          <option value="nitrification_tank">Nitrification Tank (Bể hiếu khí)</option>
          <option value="nitrification_clarifier">Nitrification Clarifier (Bể lắng Nitrat hóa)</option>
          <option value="denitrification_tank">Denitrification Tank (Bể khử Nitrat)</option>
          <option value="secondary_clarifier">Secondary Clarifier (Bể lắng cuối)</option>
        </select>
        
        <button onClick={handleAddTank} style={{ padding: '6px 12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          + Thêm bồn nối tiếp
        </button>

        <button onClick={handleReset} style={{ padding: '6px 12px', background: '#ff0000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Xóa làm lại
        </button>
      </div>

      {/* Khu vực hiển thị Canvas (Có thanh cuộn ngang tự động nếu sơ đồ quá dài) */}
      <div style={{ width: '100%', overflowX: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
        <canvas ref={canvasRef} style={{ display: 'block' }} />
      </div>
    </div>
  );
};

export default DynamicWastewaterDiagram;
