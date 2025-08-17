import { useCallback, useRef } from 'react';
import useStore from '../../store';

const useCodeExecService = () => {
  const socketRef = useRef(null);
  const term = useStore(state => state.term);
  const languageVal = useStore(state => state.languageName);
  const codeVal = useStore(state => state.editorVal);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }

    const socket = new WebSocket(import.meta.env.VITE_WSS_ENDPOINT);
    socket.binaryType = 'arraybuffer';
    socketRef.current = socket;

    socket.onopen = () => {
      const payload = JSON.stringify({
        language: String(languageVal).toLowerCase(),
        sourceCode: String(codeVal).trim(),
      });
      socket.send(payload);
      //term?.writeln('Connected to shell\r\n');
    };

    socket.onmessage = (event) => {
      if (!term) return;

      const data = typeof event.data === 'string'
        ? event.data
        : new TextDecoder().decode(new Uint8Array(event.data));

      term?.write(data);

    };


    socket.onerror = (event) => {
      term?.writeln('Error occurred!! Please try again later....');
      console.error('WebSocket error:', event);
    };

    socket.onclose = (event) => {
      console.log(event);
      console.warn('WebSocket closed:', event);

      if (event.code === 1011) {
        term?.writeln('\r\nServer error. Please try again later.');
      } else {
        term?.writeln(`\r\nConnection closed (code: ${event.code}, reason: ${event.reason || "no reason"}).`);
      }
    };

    term?.onData((data) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(data);
      }
    });
  }, [term, languageVal, codeVal]);

  const close = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      //term?.writeln('WebSocket closed manually.');
    } else {
      //term?.writeln('No active WebSocket connection to close.');
    }
  }, [term]);

  return { connect, close };
};

export default useCodeExecService;
