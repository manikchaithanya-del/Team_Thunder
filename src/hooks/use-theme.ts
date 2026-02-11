import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  initializeTheme: () => void;
}

const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }
};

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          applyTheme(newTheme);
          return { theme: newTheme };
        }),
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      initializeTheme: () => {
        const state = get();
        applyTheme(state.theme);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
