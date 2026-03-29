'use client';

import React, { useEffect } from 'react';
import { useAerationStore } from '@/store/useAerationStore';

interface InputGroupProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  color?: string;
}

const InputGroup = ({ label, unit, value, min, max, step, onChange, color = "neon-cyan" }: InputGroupProps) => (
  <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
    <div className="flex justify-between items-center text-xs">
      <span className="text-white/60 font-medium">{label}</span>
      <span className="text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded text-[10px]">
        {value} {unit}
      </span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
    />
  </div>
);

export default function AerationTank() {
  const { Q, S0, S, MLSS, thetaC, results, updateInput } = useAerationStore();

  // Khởi tạo tính toán lần đầu
  useEffect(() => {
    updateInput('Q', Q);
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#050807] text-slate-200 p-5 pb-10">
      {/* HEADER - KẾT QUẢ TỔNG THỂ */}
      <div className="sticky top-4 z-20 mb-8 overflow-hidden rounded-[2.5rem] border border-white/10 bg-forest-950/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/80 font-bold">Thể tích Aerotenk</p>
              <h2 className="text-6xl font-black text-white mt-1 tracking-tighter">
                {results.V.toFixed(1)}
                <span className="text-xl font-light text-white/40 ml-2 italic">m³</span>
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
            <div>
              <p className="text-[10px] text-white/40 uppercase">Thời gian lưu (HRT)</p>
              <p className={`text-xl font-mono font-bold ${results.isSafe ? 'text-emerald-400' : 'text-amber-500'}`}>
                {results.HRT.toFixed(1)} <span className="text-xs font-normal opacity-60">giờ</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/40 uppercase">Trạng thái vận hành</p>
              <p className={`text-[11px] font-bold mt-1 px-2 py-1 rounded-md inline-block ${results.isSafe ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                {results.isSafe ? '● TỐI ƯU' : '● CẦN ĐIỀU CHỈNH'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* THÔNG SỐ NHẬP LIỆU */}
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-1 h-4 bg-emerald-500 rounded-full" />
            <h3 className="text-sm font-bold tracking-tight uppercase text-white/80">Thông số đầu vào</h3>
          </div>
          <div className="grid gap-3">
            <InputGroup 
              label="Lưu lượng nước thải (Q)" unit="m³/d" value={Q} 
              min={10} max={2000} step={10}
              onChange={(v: number) => updateInput('Q', v)} 
            />
            <InputGroup 
              label="BOD₅ đầu vào (S₀)" unit="mg/L" value={S0} 
              min={50} max={800} step={5}
              onChange={(v: number) => updateInput('S0', v)} 
            />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-1 h-4 bg-blue-500 rounded-full" />
            <h3 className="text-sm font-bold tracking-tight uppercase text-white/80">Kiểm soát vi sinh</h3>
          </div>
          <div className="grid gap-3">
            <InputGroup 
              label="Nồng độ bùn hoạt tính (MLSS)" unit="mg/L" value={MLSS} 
              min={1500} max={5000} step={50}
              onChange={(v: number) => updateInput('MLSS', v)} 
            />
            <InputGroup 
              label="Thời gian lưu bùn (θc)" unit="ngày" value={thetaC} 
              min={5} max={25} step={1}
              onChange={(v: number) => updateInput('thetaC', v)} 
            />
          </div>
        </section>

        <div className="pt-6">
          <button className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm tracking-widest hover:bg-emerald-400 transition-colors duration-300 shadow-xl shadow-emerald-900/10 active:scale-[0.98]">
            LƯU PHƯƠNG ÁN THIẾT KẾ
          </button>
        </div>
      </div>
    </div>
  );
}
