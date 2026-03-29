import React from 'react';
import { useAerationStore } from '@/components/environments/wastewater/store/useAerationStore'; // Store Zustand đã tạo ở trên

const AerationFeature = () => {
  const { Q, S0, S, MLSS, thetaC, results, updateInput } = useAerationStore();

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-slate-100 p-4 font-sans">
      {/* 1. KẾT QUẢ - HIỂN THỊ DẠNG GLASSMORPHISM SANG TRỌNG */}
      <section className="sticky top-4 z-10 backdrop-blur-2xl bg-forest-900/40 border border-white/10 p-6 rounded-3xl shadow-2xl mb-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neon-cyan/80">Thể tích yêu cầu</p>
            <h2 className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              {results.V.toFixed(1)} <span className="text-xl font-light opacity-50">m³</span>
            </h2>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${results.isSafe ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {results.isSafe ? 'ĐẠT CHUẨN HRT' : 'CẢNH BÁO HRT'}
            </span>
            <p className="mt-2 text-2xl font-mono text-white/90">{results.HRT.toFixed(1)}h</p>
          </div>
        </div>
      </section>

      {/* 2. INPUTS - CHIA THEO NHÓM THÔNG SỐ */}
      <div className="space-y-6 pb-20">
        
        {/* Nhóm 1: Thông số nước vào */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
          <h3 className="text-sm font-semibold mb-4 border-l-2 border-neon-cyan pl-3">Thông số Nước vào (Inlet)</h3>
          <div className="space-y-5">
            <InputGroup 
              label="Lưu lượng (Q)" unit="m³/d" value={Q} 
              min={10} max={5000} step={10}
              onChange={(v) => updateInput('Q', v)} 
            />
            <InputGroup 
              label="BOD₅ Đầu vào (S₀)" unit="mg/L" value={S0} 
              min={50} max={1000} step={10}
              onChange={(v) => updateInput('S0', v)} 
            />
          </div>
        </div>

        {/* Nhóm 2: Thông số Công nghệ */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
          <h3 className="text-sm font-semibold mb-4 border-l-2 border-forest-500 pl-3">Thông số Vi sinh (Biomass)</h3>
          <div className="space-y-5">
            <InputGroup 
              label="Nồng độ bùn (MLSS)" unit="mg/L" value={MLSS} 
              min={1000} max={6000} step={100}
              onChange={(v) => updateInput('MLSS', v)} 
            />
            <InputGroup 
              label="Tuổi bùn (θc)" unit="ngày" value={thetaC} 
              min={3} max={30} step={1}
              onChange={(v) => updateInput('thetaC', v)} 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// Component con cho từng dòng nhập liệu
const InputGroup = ({ label, unit, value, min, max, step, onChange }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between text-xs text-white/60">
      <span>{label}</span>
      <span className="text-neon-cyan font-mono">{value} {unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none accent-neon-cyan cursor-pointer"
    />
  </div>
);

export default AerationFeature;
