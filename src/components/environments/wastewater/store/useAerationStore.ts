import { create } from 'zustand';

interface AerationResults {
  V: number;
  HRT: number;
  isSafe: boolean;
}

interface AerationState {
  Q: number;
  S0: number;
  S: number;
  MLSS: number;
  thetaC: number;
  results: AerationResults;
  updateInput: (key: keyof Omit<AerationState, 'results' | 'updateInput'>, value: number) => void;
}

export const useAerationStore = create<AerationState>((set, get) => ({
  Q: 500, S0: 250, S: 20, MLSS: 3000, thetaC: 10,
  results: { V: 0, HRT: 0, isSafe: true },

  updateInput: (key, value) => {
    set((state) => ({ ...state, [key]: value }));
    
    const { Q, S0, S, MLSS, thetaC } = get();
    
    // Constants kỹ thuật
    const Y = 0.6; 
    const kd = 0.06; 
    
    // Công thức tính Thể tích V (m3)
    const V = (Q * thetaC * Y * (S0 - S)) / (MLSS * (1 + kd * thetaC));
    // Tính HRT (giờ)
    const HRT = (V / Q) * 24;
    
    set({ 
      results: { 
        V, 
        HRT, 
        isSafe: HRT >= 4 && HRT <= 14 
      } 
    });
  },
}));
