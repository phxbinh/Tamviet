import { create } from "zustand";

type ChatbotStore = {
  isOpen: boolean;

  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useChatbotStore = create<ChatbotStore>((set) => ({
  isOpen: false,

  open: () => set({ isOpen: true }),

  close: () => set({ isOpen: false }),

  toggle: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),
}));