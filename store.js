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
      isAuthenticated: true,
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      term: null,
      setTerm: (termInstance) => set({ term: termInstance }),
      profileData: null,
      setProfileData: (data) => set({ profileData: data }),
    }),
    {
      name: 'sandbox-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        languageName: state.languageName,
        editorTheme: state.editorTheme,
        editorVal: state.editorVal,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useStore;