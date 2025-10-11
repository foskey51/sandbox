import { useCallback, useRef } from 'react';
import useStore from '../../store';

const useCodeExecService = () => {
  const { setLoading } = useStore();
  const socketRef = useRef(null);
  const term = useStore(state => state.term);
  const languageVal = useStore(state => state.languageName);
  const codeVal = useStore(state => state.editorVal);
  let dataListener = null;

  const connect = useCallback(() => {
    setLoading(true);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
    term?.reset();

    const socket = new WebSocket(`${import.meta.env.VITE_WSS_ENDPOINT}/code/exec`);
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
      setLoading(false);
      if (!term) return;

      const data = typeof event.data === 'string'
        ? event.data
        : new TextDecoder().decode(new Uint8Array(event.data));

      term?.write(data);

    };

    socket.onerror = (event) => {
      setLoading(false);
      term?.writeln('Error occurred!! Please try again later....');
      console.error('WebSocket error:', event);
    };

    socket.onclose = (event) => {
      setLoading(false);
      console.warn('WebSocket closed:', event);
    };

    if (dataListener) {
      dataListener.dispose();
    }
    dataListener = term?.onData((data) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(data);
      }
    });
  }, [term, languageVal, codeVal]);

  const close = useCallback(() => {
    setLoading(false);
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
