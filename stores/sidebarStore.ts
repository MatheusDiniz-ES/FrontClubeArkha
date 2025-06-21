import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UseSidebarProps {
  isOpen: boolean,
  setIsOpen: (e: boolean) => void;
}

const useStore = create<UseSidebarProps>()(persist(
  (set) => ({
    isOpen: true,
    setIsOpen: (e) => set({
      isOpen: e
    })
  }),
  {
    name: 'sidebar-storage',
    storage:  createJSONStorage(() => localStorage),
  }
));

export const useSidebarStorage = useStore;