import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import Split from 'react-split';
import { ArrowsIn, ArrowsOut, DarkModeIcon, DownloadIcon, LightModeIcon } from '../utils/Icons';
import useStore from "../../store";

const WebDev = () => {
  const [html, setHtml] = useState(`<div class="container">
  <h1 class="sitename">Sandbox</h1>
  <p id="tagline"></p>
</div>`);

  const [css, setCss] = useState(`body {
  font-family: sans-serif;
  background-color: #f9fafb;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
}
.sitename {
  font-size: 2.5em;
  color: #1f2937;
}
.tagline {
  font-size: 1.2em;
  color: #6b7280;
}`);

  const store = useStore();
  const [js, setJs] = useState(`document.getElementById('tagline').innerHTML = "Learn something new today";`);
  const [srcDoc, setSrcDoc] = useState('');
  const [activeTab, setActiveTab] = useState('html');
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);

  const darkMode = useStore(state => state.darkMode);
  const { setDarkMode } = store;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head><style>${css}</style></head>
          <body>${html}<script>${js}<\/script></body>
        </html>
      `);
    }, 300);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const downloadCode = () => {
    const fullHtml = `
      <html>
        <head><style>${css}</style></head>
        <body>${html}<script>${js}<\/script></body>
      </html>
    `;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderEditor = () => {
    const language = activeTab === 'html' ? 'html' : activeTab === 'css' ? 'css' : 'javascript';
    const value = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
    const onChange = activeTab === 'html' ? setHtml : activeTab === 'css' ? setCss : setJs;

    return (
      <Editor
        defaultLanguage={language}
        value={value}
        onChange={(value) => onChange(value || '')}
        theme={darkMode ? 'vs-dark' : 'light'}
        options={{ fontSize: 14, minimap: { enabled: false } }}
      />
    );
  };

  const handleKeyDown = useCallback((e) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

    if (ctrlKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      setIsEditorFullscreen(prev => !prev);
    }

    if (ctrlKey && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      setIsPreviewFullscreen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={"h-screen w-screen font-sans overflow-hidden"}>
      <div className="flex justify-between items-center p-3 bg-gray-200 border-b border-gray-300 dark:bg-black dark:border-gray-700">
        <div className='flex mr-auto space-x-2 dark:text-white text-black'>
          <span className="text-xl font-mono font-semibold">Sandbox</span>
        </div>
        <div className="flex ml-auto space-x-2">
          <button
            onClick={downloadCode}
            className="flex items-center bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-semibold text-white dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <span className="flex items-center gap-2">
              <DownloadIcon />
              Download Code
            </span>
          </button>
          <button
            onClick={toggleTheme}
            className="bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 px-4 py-2 rounded font-medium"
          >
            {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
          </button>
        </div>
      </div>

      {!isEditorFullscreen && !isPreviewFullscreen ? (
        <Split
          className="flex h-[calc(100%-52px)]"
          sizes={[50, 50]}
          minSize={200}
          gutterSize={8}
          gutter={(index, direction) => {
            const gutter = document.createElement('div');
            gutter.className = 'gutter gutter-' + direction;
            return gutter;
          }}
        >
          <div className="flex flex-col bg-gray-100 relative dark:bg-gray-800">
            <div className="flex items-center justify-between bg-gray-200 border-b border-gray-300 px-4 py-2 dark:bg-gray-900 dark:border-gray-700">
              <div className="flex space-x-2">
                {['html', 'css', 'js'].map((lang) => (
                  <button
                    key={lang}
                    className={`px-3 py-1 capitalize font-medium rounded ${activeTab === lang
                      ? 'bg-gray-400 text-black dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'
                      }`}
                    onClick={() => setActiveTab(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsEditorFullscreen(true)}
                className="text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                title="Fullscreen Editor (Ctrl+E / Cmd+E)"
              >
                <ArrowsOut />
              </button>
            </div>
            <div className="flex-grow">{renderEditor()}</div>
          </div>

          <div className="relative bg-white dark:bg-black">
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={() => setIsPreviewFullscreen(true)}
                className="text-black bg-gray-300 hover:bg-gray-400 p-1 rounded dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                title="Fullscreen Preview (Ctrl+P / Cmd+P)"
              >
                <ArrowsOut />
              </button>
            </div>
            <iframe
              srcDoc={srcDoc}
              title="Live Preview"
              sandbox="allow-scripts"
              frameBorder="0"
              className="w-full h-full bg-white"
            />
          </div>
        </Split>
      ) : isEditorFullscreen ? (
        <div className="h-full w-full bg-gray-100 flex flex-col dark:bg-gray-800">
          <div className="flex items-center justify-between bg-gray-200 border-b border-gray-300 px-4 py-2 dark:bg-gray-900 dark:border-gray-700">
            <div className="flex space-x-2">
              {['html', 'css', 'js'].map((lang) => (
                <button
                  key={lang}
                  className={`px-3 py-1 capitalize font-medium rounded ${activeTab === lang
                    ? 'bg-gray-400 text-black dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'
                    }`}
                  onClick={() => setActiveTab(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsEditorFullscreen(false)}
              className="text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              title="Exit Fullscreen (Ctrl+E / Cmd+E)"
            >
              <ArrowsIn />
            </button>
          </div>
          <div className="flex-grow">{renderEditor()}</div>
        </div>
      ) : (
        <div className="relative w-full h-full bg-white dark:bg-black">
          <button
            onClick={() => setIsPreviewFullscreen(false)}
            className="absolute top-2 right-2 z-10 text-black bg-gray-300 hover:bg-gray-400 p-2 rounded dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            title="Exit Fullscreen (Ctrl+P / Cmd+P)"
          >
            <ArrowsIn />
          </button>
          <iframe
            srcDoc={srcDoc}
            title="Live Preview"
            sandbox="allow-scripts"
            frameBorder="0"
            className="w-full h-full bg-white"
          />
        </div>
      )}

      <style>{`
      .gutter {
        background-color: #d1d5db;
        background-clip: content-box;
      }
      .gutter.gutter-horizontal {
        cursor: col-resize;
        width: 8px;
      }
      .gutter.gutter-vertical {
        cursor: row-resize;
        height: 8px;
      }
    `}</style>
    </div>
  );
};

export default WebDev;
