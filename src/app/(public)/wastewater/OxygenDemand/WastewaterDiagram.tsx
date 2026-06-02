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

    // =========================================================
    // HI-DPI / RETINA FIX
    // =========================================================

    const cssWidth = 1200;
    const cssHeight = 420;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;

    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    ctx.scale(dpr, dpr);

    // =========================================================
    // STYLE
    // =========================================================

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    ctx.strokeStyle = '#111';
    ctx.fillStyle = '#111';

    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.font = '13px Arial';

    // =========================================================
    // CONSTANTS
    // =========================================================

    const WATER_Y = 180;
    const FLOW_Y = WATER_Y + 22;

    // =========================================================
    // HELPERS
    // =========================================================

    const line = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const arrowHead = (
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const size = 9;

      ctx.beginPath();
      ctx.moveTo(x2, y2);

      ctx.lineTo(
        x2 - size * Math.cos(angle - Math.PI / 7),
        y2 - size * Math.sin(angle - Math.PI / 7)
      );

      ctx.lineTo(
        x2 - size * Math.cos(angle + Math.PI / 7),
        y2 - size * Math.sin(angle + Math.PI / 7)
      );

      ctx.closePath();
      ctx.fill();
    };

    const arrow = (
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => {
      line(x1, y1, x2, y2);
      arrowHead(x1, y1, x2, y2);
    };

    const polyArrow = (pts: Point[]) => {
      ctx.beginPath();

      ctx.moveTo(pts[0].x, pts[0].y);

      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }

      ctx.stroke();

      const p1 = pts[pts.length - 2];
      const p2 = pts[pts.length - 1];

      arrowHead(p1.x, p1.y, p2.x, p2.y);
    };

    // =========================================================
    // WATER LEVEL
    // =========================================================

    const drawWaterLine = (
      x: number,
      y: number,
      width: number
    ) => {
      ctx.save();

      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(x + 4, y);
      ctx.lineTo(x + width - 4, y);

      ctx.stroke();

      ctx.restore();
    };

    // =========================================================
    // CLARIFIER
    // =========================================================

    const drawClarifier = (
      x: number,
      y: number,
      w: number,
      h: number,
      title: string
    ) => {
      const topH = 34;

      // outer

      ctx.beginPath();

      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y);

      ctx.lineTo(x + w, y + topH);

      ctx.lineTo(x + w / 2, y + h);

      ctx.lineTo(x, y + topH);

      ctx.closePath();

      ctx.stroke();

      // water level

      drawWaterLine(x, WATER_Y, w);

      // sludge hopper center

      line(
        x + w / 2,
        y + h,
        x + w / 2,
        y + h + 28
      );

      arrowHead(
        x + w / 2,
        y + h,
        x + w / 2,
        y + h + 28
      );

      ctx.fillText(
        'Sludge',
        x + w / 2 - 20,
        y + h + 45
      );

      // title

      ctx.font = '13px Arial';

      const tw = ctx.measureText(title).width;

      ctx.fillText(
        title,
        x + w / 2 - tw / 2,
        y - 18
      );
    };

    // =========================================================
    // AERATION TANK
    // =========================================================

    const drawAerationTank = (
      x: number,
      y: number,
      w: number,
      h: number
    ) => {
      ctx.strokeRect(x, y, w, h);

      drawWaterLine(x, WATER_Y, w);

      // air pipe

      line(x + 18, y - 42, x + 18, y + h - 10);

      line(
        x + 18,
        y + h - 10,
        x + w - 18,
        y + h - 10
      );

      ctx.fillText('Air', x + 4, y - 48);

      // diffuser

      ctx.save();

      ctx.setLineDash([3, 3]);

      line(
        x + 24,
        y + h - 10,
        x + w - 24,
        y + h - 10
      );

      ctx.restore();

      // circulation arrow

      ctx.beginPath();

      ctx.arc(
        x + w / 2,
        y + h / 2 + 6,
        22,
        0.3,
        Math.PI * 1.9
      );

      ctx.stroke();

      arrowHead(
        x + w / 2 + 15,
        y + h / 2 - 15,
        x + w / 2 + 18,
        y + h / 2 - 10
      );

      ctx.fillText(
        'Nitrification tank',
        x + 16,
        y + h + 22
      );
    };

    // =========================================================
    // DENITRIFICATION
    // =========================================================

    const drawDenitrification = (
      x: number,
      y: number,
      w: number,
      h: number
    ) => {
      ctx.strokeRect(x, y, w, h);

      drawWaterLine(x, WATER_Y, w);

      const baffleX = x + 108;

      // hanging baffle

      line(
        baffleX,
        y,
        baffleX,
        y + h - 18
      );

      // mixer shaft

      const mixerX = x + 54;

      line(mixerX, y - 20, mixerX, y + 50);

      // impeller

      ctx.beginPath();

      ctx.ellipse(
        mixerX,
        y + 50,
        14,
        5,
        0,
        0,
        Math.PI * 2
      );

      ctx.stroke();

      // rotation arrow

      ctx.beginPath();

      ctx.arc(
        mixerX,
        y - 18,
        9,
        0,
        Math.PI * 1.7
      );

      ctx.stroke();

      arrowHead(
        mixerX + 5,
        y - 25,
        mixerX + 8,
        y - 20
      );

      ctx.fillText(
        'Mixer',
        mixerX - 18,
        y - 32
      );

      // reaeration pipe

      line(
        baffleX + 18,
        y - 42,
        baffleX + 18,
        y + h - 10
      );

      line(
        baffleX + 18,
        y + h - 10,
        x + w - 10,
        y + h - 10
      );

      ctx.fillText(
        'Air',
        baffleX + 6,
        y - 48
      );

      // bubbles

      const bubbles = [
        [baffleX + 26, y + 52],
        [baffleX + 32, y + 42],
        [baffleX + 38, y + 32],
        [baffleX + 44, y + 22],
      ];

      bubbles.forEach(([bx, by]) => {
        ctx.beginPath();
        ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.fillText(
        'Denitrification tank',
        x + 12,
        y + h + 22
      );
    };

    // =========================================================
    // DRAW SYSTEM
    // =========================================================

    const clar1X = 90;

    drawClarifier(
      clar1X,
      160,
      88,
      92,
      'Primary clarifier'
    );

    arrow(20, FLOW_Y, clar1X, FLOW_Y);

    ctx.font = 'bold 13px Arial';
    ctx.fillText('Influent', 24, FLOW_Y - 12);

    // =========================================================

    const nitX = 280;

    drawAerationTank(
      nitX,
      160,
      150,
      80
    );

    arrow(
      clar1X + 88,
      FLOW_Y,
      nitX,
      FLOW_Y
    );

    // =========================================================

    const clar2X = 500;

    drawClarifier(
      clar2X,
      160,
      88,
      92,
      'Nitrification clarifier'
    );

    arrow(
      nitX + 150,
      FLOW_Y,
      clar2X,
      FLOW_Y
    );

    // =========================================================

    const denitX = 670;

    drawDenitrification(
      denitX,
      160,
      170,
      80
    );

    arrow(
      clar2X + 88,
      FLOW_Y,
      denitX,
      FLOW_Y
    );

    // methanol

    arrow(
      630,
      105,
      630,
      FLOW_Y
    );

    ctx.fillText('Methanol', 598, 95);

    // =========================================================

    const clar3X = 920;

    drawClarifier(
      clar3X,
      160,
      88,
      92,
      'Secondary clarifier'
    );

    arrow(
      denitX + 170,
      FLOW_Y,
      clar3X,
      FLOW_Y
    );

    arrow(
      clar3X + 88,
      FLOW_Y,
      1090,
      FLOW_Y
    );

    ctx.font = 'bold 13px Arial';

    ctx.fillText(
      'Effluent',
      1020,
      FLOW_Y - 12
    );

    // =========================================================
    // RAS LINES
    // =========================================================

    ctx.font = '12px Arial';

    polyArrow([
      {
        x: clar2X + 44,
        y: 280,
      },
      {
        x: clar2X + 44,
        y: 315,
      },
      {
        x: 210,
        y: 315,
      },
      {
        x: 210,
        y: FLOW_Y,
      },
    ]);

    ctx.fillText(
      'Return activated sludge',
      255,
      330
    );

    polyArrow([
      {
        x: clar3X + 44,
        y: 280,
      },
      {
        x: clar3X + 44,
        y: 350,
      },
      {
        x: 610,
        y: 350,
      },
      {
        x: 610,
        y: FLOW_Y,
      },
    ]);

    ctx.fillText(
      'Return activated sludge',
      700,
      365
    );

    // =========================================================

    ctx.font = '15px Arial';
    ctx.fillText('(c)', 35, 370);

  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          border: '1px solid #ddd',
          background: '#fff',
        }}
      />
    </div>
  );
};

export default WastewaterDiagram;