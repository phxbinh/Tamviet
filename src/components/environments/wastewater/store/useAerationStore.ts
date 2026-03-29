// store/useAerationStore.ts
import { create } from 'zustand';

interface AerationState {
  Q: number;      // Lưu lượng (m3/day)
  S0: number;     // BOD vào (mg/L)
  S: number;      // BOD ra (mg/L)
  MLSS: number;   // Nồng độ bùn (mg/L)
  thetaC: number; // Thời gian lưu bùn (days)
  results: {
    V: number;
    HRT: number;
    isSafe: boolean;
  };
  updateInput: (key: string, value: number) => void;
}

export const useAerationStore = create<AerationState>((set, get) => ({
  Q: 500, S0: 250, S: 20, MLSS: 3000, thetaC: 10,
  results: { V: 0, HRT: 0, isSafe: true },
  
  updateInput: (key, value) => {
    set({ [key]: value });
    const { Q, S0, S, MLSS, thetaC } = get();
    
    // Công thức tính Thể tích (V)
    const Y = 0.6; // Hệ số thu hoạch bùn
    const kd = 0.06; // Hệ số phân hủy
    const V = (Q * thetaC * Y * (S0 - S)) / (MLSS * (1 + kd * thetaC));
    const HRT = (V / Q) * 24;
    
    set({ results: { V, HRT, isSafe: HRT >= 4 && HRT <= 12 } });
  },
}));
