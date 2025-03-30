import { useEffect, useRef } from "react";
import * as monaco from 'monaco-editor';
import NavBar from "./NavBar";
import Terminal from "./Terminal";
import useStore from "../../store";

const Editor = () => {
  const terminalCollapsed = useStore(state => state.terminalCollapsed);
  const editorTheme = useStore(state => state.editorTheme);
  const darkMode = useStore(state => state.darkMode);
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const languageName = useStore((state) => state.languageName);
  const emptyLines = Array(50).fill("\n").join('');

  useEffect(() => {
    if (editorRef.current && !editorInstanceRef.current) {
      const editor = monaco.editor.create(editorRef.current, {
        value: emptyLines,
        language: languageName.toLowerCase(),
        automaticLayout: true,
      });
      editorInstanceRef.current = editor;
    }
    monaco.editor.setTheme(editorTheme);
  }, [darkMode]);

  return (
    <div className="flex flex-col h-screen">
      {/* NavBar */}
      <NavBar />

      {/* Code Editor */}
      <div
        className={`w-full transition-all duration-300 ease-in-out ${
          terminalCollapsed ? "h-[calc(100%-3rem)]" : "h-[75%]"
        } ${darkMode ? "bg-[#0D1117]" : "bg-white"}`}
      >
        <div className="w-full h-full" ref={editorRef}></div>
      </div>

      {/* Terminal */}
      <Terminal />
    </div>
  );
};

export default Editor;
