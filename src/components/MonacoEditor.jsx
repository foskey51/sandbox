import { useEffect, useRef, useCallback, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import nightOwl from 'monaco-themes/themes/Night Owl.json';
import useStore from '../../store';

const supportedLanguages = ['java', 'javascript', 'c', 'cpp', 'php', 'rust', 'go', 'csharp'];

const MonacoEditor = () => {
  const darkMode = useStore(state => state.darkMode);
  const languageName = useStore(state => state.languageName)?.toLowerCase();
  const editorVal = useStore(state => state.editorVal);
  const { setEditorVal } = useStore();
  const monaco = useMonaco();
  const debounceRef = useRef(null);
  const [themeReady, setThemeReady] = useState(false);

  const debouncedSetEditorVal = useCallback((value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setEditorVal(value), 300);
  }, [setEditorVal]);

  const handleEditorChange = useCallback((value) => {
    if (value !== undefined) debouncedSetEditorVal(value);
  }, [debouncedSetEditorVal]);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('night-owl', nightOwl);
      setThemeReady(true);
      supportedLanguages.forEach(lang => {
        if (!monaco.languages.getLanguages().some(l => l.id === lang)) {
          console.warn(`Language "${lang}" is not supported by Monaco out-of-the-box.`);
        }
      });
    }
  }, [monaco]);

  if (!themeReady && darkMode) {
    return <div className="flex items-center justify-center h-full">Initializing editor...</div>;
  }

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        width="100%"
        language={supportedLanguages.includes(languageName) ? languageName : 'plaintext'}
        value={editorVal}
        theme={darkMode ? 'night-owl' : 'light'}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          insertSpaces: true,
          renderWhitespace: 'selection',
          bracketPairColorization: { enabled: true },
          autoIndent: 'full',
          formatOnPaste: true,
          formatOnType: true,
        }}
        loading={<div className="flex items-center justify-center h-full">Loading editor...</div>}
      />
    </div>
  );
};

export default MonacoEditor;
