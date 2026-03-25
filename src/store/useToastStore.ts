/*
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
*/



// store/useToastStore.ts
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  showToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Thêm toast mới vào mảng
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    // Tự động xóa sau 3.5s
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3500);
  },

  removeToast: (id) => 
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));


