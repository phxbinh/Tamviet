import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string | null;
  type: ToastType;
  isVisible: boolean;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'success',
  isVisible: false,

  showToast: (message, type = 'success') => {
    // Nếu có toast đang hiện, ẩn đi trước để reset animation
    set({ isVisible: false });
    
    // Đợi một chút rồi mới hiện toast mới
    setTimeout(() => {
      set({ message, type, isVisible: true });
    }, 10);

    // Tự động ẩn sau 3.5 giây
    setTimeout(() => {
      set({ isVisible: false });
    }, 3500);
  },

  hideToast: () => set({ isVisible: false }),
}));
