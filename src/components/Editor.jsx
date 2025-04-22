import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import nightOwl from "monaco-themes/themes/Night Owl.json";

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import useStore from "../../store";
const Editor = () => {
  const darkMode = useStore(state => state.darkMode);
  const languageName = useStore(state => state.languageName);
  const editorVal = useStore(state => state.editorVal);
  const { setEditorVal } = useStore();
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    let debounceTimeout;

    self.MonacoEnvironment = {
      getWorker(_, label) {
        switch (label) {
          case 'json': return new JsonWorker();
          case 'css':
          case 'scss':
          case 'less': return new CssWorker();
          case 'html':
          case 'handlebars':
          case 'razor': return new HtmlWorker();
          case 'typescript':
          case 'javascript': return new TsWorker();
          default: return new EditorWorker();
        }
      }
    };

    if (editorRef.current && !editorInstanceRef.current) {
      const editor = monaco.editor.create(editorRef.current, {
        value: editorVal,
        language: languageName.toLowerCase(),
        automaticLayout: true,
        fontSize: 15,
        fontFamily: "Fira Code, monospace",
        fontLigatures: true,
        lineHeight: 24,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        wordWrap: "off",
      });
      editorInstanceRef.current = editor;

      editor.onDidChangeModelContent(() => {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }

        debounceTimeout = setTimeout(() => {
          const updatedValue = editor.getValue();
          setEditorVal(updatedValue);
          console.log(updatedValue);
        }, 500);
      });
    }

    monaco.editor.defineTheme('nightOwl', nightOwl);
    monaco.editor.setTheme(darkMode ? 'nightOwl' : '');

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.dispose();
        editorInstanceRef.current = null;
      }
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };

  }, [darkMode, languageName]);

  return (
    <div className={`w-full h-full ${darkMode ? "bg-[#0D1117]" : "bg-white"}`}>
      <div className="w-full h-full" ref={editorRef}></div>
    </div>
  );
};

export default Editor;