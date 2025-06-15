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
      editorVal: '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
      setEditorVal: (value) => set({ editorVal: value }),
      authenticated:false,
      isAuthenticated: (value) => set({authenticated: value}),
    }),
    {
      name: 'sandbox-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        languageName: state.languageName,
        editorTheme: state.editorTheme,
        editorVal: state.editorVal,
      }),
    }
  )
);

export default useStore;