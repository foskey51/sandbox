import { useRef, useEffect, useState, useLayoutEffect, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import useStore from "../../store";
import { IconCopy, IconDotsVertical, IconTrash } from "@tabler/icons-react";
import EmptyChatScreen from "./EmptyChatScreen";
import { toast } from "react-toastify";

const Assistant = () => {
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const controllerRef = useRef(null);
  const shouldStreamRef = useRef(true);
  const streamBufferRef = useRef(""); // Buffer for streaming content

  const chatboxInput = useStore(state => state.chatboxInput);
  const { setChatboxInput, setMessages } = useStore();
  const messages = useStore(state => state.messages);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAssistantStarted, setHasAssistantStarted] = useState(false);
  const [streamingContent, setStreamingContent] = useState(""); // Local state for streaming
  const darkMode = useStore(state => state.darkMode);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, []);

  const handleSubmit = async () => {
    if (!chatboxInput.trim() || isLoading) return;
    const newMessages = [...messages, { role: "user", content: chatboxInput }];
    setMessages(newMessages);
    setChatboxInput("");
    setIsLoading(true);
    setHasAssistantStarted(false);
    setStreamingContent("");
    streamBufferRef.current = "";
    shouldStreamRef.current = true;
    controllerRef.current = new AbortController();

    try {
      const systemMessage = {
        role: "system",
        content: 'You are a programming tutor. Give short, clear code examples that always include a complete main function (use class name as "App" for java). Keep examples short and correct ask follow-up question to engage the user.'
      };

      const response = await fetch(`${import.meta.env.VITE_LLM_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2",
          stream: true,
          messages: [systemMessage, ...newMessages],
        }),
        signal: controllerRef.current.signal,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantMessage = "";
      let buffer = ""; // Buffer for incomplete JSON

      while (true) {
        if (!shouldStreamRef.current) break;
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split("\n");
        
        // Keep the last incomplete line in buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content && shouldStreamRef.current) {
              if (!hasAssistantStarted) setHasAssistantStarted(true);
              assistantMessage += parsed.message.content;
              streamBufferRef.current = assistantMessage;
              
              // Update immediately for Tauri - no throttling
              setStreamingContent(assistantMessage);
            }
          } catch (e) {
            // Skip malformed JSON chunks silently in Tauri
          }
        }
      }

      // Final update with complete message
      if (streamBufferRef.current) {
        setMessages([...newMessages, { role: "assistant", content: streamBufferRef.current }]);
        setStreamingContent("");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Fetch error:", error);
      }
    } finally {
      setIsLoading(false);
      setHasAssistantStarted(false);
    }
  };

  const stopStreaming = () => {
    shouldStreamRef.current = false;
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    
    // Save whatever we have so far
    if (streamBufferRef.current) {
      setMessages([...messages, { role: "assistant", content: streamBufferRef.current }]);
    }
    
    setIsLoading(false);
    setStreamingContent("");
    setHasAssistantStarted(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClearChat = useCallback(() => {
    if (window.confirm("Are you sure you want to clear the chat?")) {
      setMessages([]);
      setChatboxInput("");
      toast.success("Chats cleared");
      shouldStreamRef.current = false;
      controllerRef.current?.abort();
      setMenuOpen(false);
    }
  }, [setMessages, setChatboxInput]);

  const copyToClipboard = useCallback(async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("!! Error copying text !!");
    }
  }, []);

  useEffect(() => {
    handleInput();
  }, [chatboxInput, handleInput]);

  useLayoutEffect(() => {
    const el = messagesEndRef.current;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, streamingContent]);

  const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );

  const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
      <rect width="14" height="14" x="3" y="3" rx="2" />
    </svg>
  );

  const CopyButton = ({ code }) => (
    <IconCopy size={18} className="absolute top-3 right-2 cursor-pointer"
      onClick={() => copyToClipboard(code)} />
  );

  const SkeletonLoader = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
      }}
      className="animate-pulse"
    >
      <div
        style={{
          padding: "1rem",
          borderRadius: "0.75rem",
          width: "100%",
          maxWidth: "97%",
          backgroundColor: darkMode ? "#1F2A44" : "#E5E7EB",
          border: darkMode ? "1px solid #4B5563" : "1px solid #9CA3AF",
        }}
      >
        <div
          style={{
            height: "1rem",
            backgroundColor: darkMode ? "#4B5563" : "#D1D5DB",
            borderRadius: "0.25rem",
            width: "75%",
            margin: "0 auto 0.5rem",
          }}
        ></div>
        <div
          style={{
            height: "1rem",
            backgroundColor: darkMode ? "#4B5563" : "#D1D5DB",
            borderRadius: "0.25rem",
            width: "50%",
            margin: "0 auto 0.5rem",
          }}
        ></div>
        <div
          style={{
            height: "1rem",
            backgroundColor: darkMode ? "#4B5563" : "#D1D5DB",
            borderRadius: "0.25rem",
            width: "66%",
            margin: "0 auto",
          }}
        ></div>
      </div>
    </div>
  );

  const renderers = useMemo(() => ({
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const codeStr = String(children).replace(/\n$/, "");
      return !inline && match ? (
        <div className="relative overflow-auto">
          <CopyButton code={codeStr} />
          <SyntaxHighlighter 
            className="overflow-auto" 
            style={darkMode ? oneDark : oneLight} 
            language={match[1]} 
            PreTag="div" 
            {...props}
          >
            {codeStr}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-200 dark:bg-gray-800 p-1 rounded text-sm">{children}</code>
      );
    },
  }), [darkMode, copyToClipboard]);

  // Combine messages with streaming content for display
  const displayMessages = useMemo(() => {
    if (streamingContent && isLoading) {
      return [...messages, { role: "assistant", content: streamingContent, isStreaming: true }];
    }
    return messages;
  }, [messages, streamingContent, isLoading]);

  return (
    <div className="flex flex-col h-full w-full dark:bg-black dark:text-white bg-white text-black relative">
      <div className="flex items-center justify-between py-[1.07rem] border-b border-gray-300 relative">
        <h1 className="text-lg font-bold absolute left-1/2 transform -translate-x-1/2">
          Sandbox AI
        </h1>

        <div className="relative ml-auto">
          <IconDotsVertical
            onClick={() => setMenuOpen(!menuOpen)}
            size={18}
            className="cursor-pointer"
          />

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50">
              <button
                onClick={handleClearChat}
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <IconTrash size={18} className="text-red-500" />
                Clear Chat
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 min-h-0 overflow-y-auto py-3 space-y-4 relative"
      >
        {displayMessages.length === 0 && !isLoading && <EmptyChatScreen />}

        {displayMessages.map((msg, idx) => (
          <div key={idx} className="w-full flex flex-col items-center">
            <div
              className={`p-3 rounded-xl max-w-full w-full md:max-w-[97%] whitespace-pre-wrap break-words border overflow-x-auto
        ${msg.role === "user"
                  ? "text-black dark:text-white dark:border-white border-black text-center"
                  : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white border-gray-400 dark:border-gray-700"
                }`}
            >
              {msg.role === "assistant" ? (
                <ReactMarkdown components={renderers}>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
            {isLoading && !hasAssistantStarted && idx === displayMessages.length - 1 && msg.role === "user" && (
              <div className="w-full flex justify-center mt-16 relative">
                <SkeletonLoader />
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="border-t border-black dark:border-gray-700 px-4 py-3 flex items-end relative gap-2">
        <div className="flex w-full bg-white dark:bg-black border border-black dark:border-gray-700 rounded-xl px-3">
          <textarea
            ref={textareaRef}
            value={chatboxInput}
            onChange={(e) => setChatboxInput(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-left text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 
             resize-none py-3 pr-2 focus:outline-none truncate max-h-[200px]"
            placeholder="Say something"
            rows={1}
            disabled={isLoading}
          />
          <button onClick={isLoading ? stopStreaming : handleSubmit} className="mb-1">
            {isLoading ? <StopIcon /> : <SendIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;