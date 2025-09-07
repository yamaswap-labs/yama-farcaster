import { create } from 'zustand';

export type LuckyDrawDialogState = {
  isOpen: boolean;
  show: () => void;
  hide: () => void;
};

const useLuckyDrawDialogStore = create<LuckyDrawDialogState>((set) => ({
  isOpen: false,
  show: () => set({ isOpen: true }),
  hide: () => set({ isOpen: false }),
}));

export default useLuckyDrawDialogStore;
