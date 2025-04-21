import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      terminalCollapsed: true,
      setTerminalCollapsed: (value) => set({ terminalCollapsed: value }),
      languageName: 'JavaScript',
      setLanguageName: (value) => set({ languageName: value }),
      languageList: ["Java", "JavaScript", "C", "Cpp", "Php", "Rust", "Go", "C#"],
      darkMode: false, 
      setDarkMode: (value) => set({ darkMode: value }),
    }),
    {
      name: 'sandbox-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        languageName: state.languageName,
        editorTheme: state.editorTheme,
      }),
    }
  )
);

export default useStore;