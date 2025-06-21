import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeProps = 'dark' | 'light'

interface UseThemeStoreProps {
  darkMode: boolean,
  setDarkMode: (e: boolean) => void;
  color: "cyan" | "orange" | "violet" | "emerald"
  setColor: (e: "cyan" | "orange" | "violet" | "emerald") => void;
}

const useStore = create<UseThemeStoreProps>()(persist(
  (set) => ({
    darkMode: false,
    setDarkMode: (e) => set({
      darkMode: e
    }),
    color: 'cyan',
    setColor: (e) => set({
      color: e
    })
  }),
  {
    name: 'theme-storage',
    storage:  createJSONStorage(() => localStorage),
  }
));

export const useThemeStore = useStore;