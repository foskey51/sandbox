import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useEffect, useRef } from 'react';
import useStore from '../../store';

const TerminalView = () => {
  const { setTerm } = useStore();
  const darkMode = useStore(state => state.darkMode);
  const terminalRef = useRef(null);
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "'Fira Code', 'Courier New', monospace",
      theme: {
        background: darkMode ? '#000000' : '#ffffff',
        foreground: darkMode ? '#ffffff' : '#000000',
        cursor: darkMode ? '#ffffff' : '#000000',
      },
      scrollback: 1000,
      allowTransparency: true,
    });
    termRef.current = term;
    setTerm(term);

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddonRef.current = fitAddon;

    if (terminalRef.current) {
      term.open(terminalRef.current);
      fitAddon.fit();
    }

    const resizeObserver = new ResizeObserver(() => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    });

    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      term.dispose();
      setTerm(null);
    };
  }, []);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.options.theme = {
        background: darkMode ? '#000000' : '#ffffff',
        foreground: darkMode ? '#ffffff' : '#000000',
        cursor: darkMode ? '#ffffff' : '#000000',
      };
    }
  }, [darkMode]);

  const handleClear = () => {
    if (termRef.current) {
      termRef.current.clear();
    }
  };

  return (
    <div className="flex flex-col w-full h-full mb-12 ">
      {/* Header (fixed) */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 dark:text-white text-black border-b-gray-400">
        <span className="font-medium ">Terminal</span>
        <button
          onClick={handleClear}
          className="border-2 border-gray-500 dark:border-gray-200 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105"
        >
          Clear
        </button>
      </div>

      {/* Terminal Area (scrollable) */}
      <div
        ref={terminalRef}
        className="flex-1 pl-3 pt-4 pb-14 overflow-auto dark:bg-black"
      />
    </div>
  );
};

export default TerminalView;
