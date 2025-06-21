import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Assistant = () => {
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const controllerRef = useRef(null);
  const shouldStreamRef = useRef(true);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const controller = new AbortController();

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    shouldStreamRef.current = true;
    controllerRef.current = new AbortController();

    try {
      const response = await fetch(`${import.meta.env.VITE_LLM_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2",
          stream: true,
          messages: [...newMessages],
        }),
          signal: controller.signal,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantMessage = "";

      while (true) {
        if (!shouldStreamRef.current) break;

        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content && shouldStreamRef.current) {
              assistantMessage += parsed.message.content;
              setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
            }
          } catch (err) {
            console.error("Failed to parse chunk:", line, err);
          }
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Fetch error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopStreaming = () => {
    shouldStreamRef.current = false;
    controllerRef.current?.abort();
    controller.abort();
    setIsLoading(false);
  };

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 10;
    setShowScrollButton(!isAtBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat?")) {
      setMessages([]);
      setInput("");
      shouldStreamRef.current = false;
      controllerRef.current?.abort();
    }
  };

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  useEffect(() => {
    handleInput();
  }, [input]);

  useEffect(() => {
    if (!isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Icons
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
    <button
      onClick={() => copyToClipboard(code)}
      className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded"
    >
      Copy
    </button>
  );

  const ScrollDownArrow = () => (
    <button
      onClick={scrollToBottom}
      className="absolute left-1/2 transform -translate-x-1/2 bottom-24 dark:bg-black dark:text-white bg-white text-black p-2 rounded-full shadow-md z-10"
    >
      ↓
    </button>
  );

  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const codeStr = String(children).replace(/\n$/, "");
      return !inline && match ? (
        <div className="relative">
          <CopyButton code={codeStr} />
          <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
            {codeStr}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-200 dark:bg-gray-800 p-1 rounded text-sm">{children}</code>
      );
    },
  };

  return (
    <div className="flex flex-col h-full w-full dark:bg-black dark:text-white bg-white text-black relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-center items-center py-4 border-b border-black dark:border-gray-700">
        <h1 className="text-lg font-semibold">Llama AI</h1>
      </div>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-3 space-y-4"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className="w-full flex justify-center">
            <div
              className={`p-3 rounded-xl max-w-full w-full md:max-w-[97%] whitespace-pre-wrap break-words border overflow-x-auto
                ${
                  msg.role === "user"
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
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom arrow */}
      {showScrollButton && <ScrollDownArrow />}

      {/* Input Area */}
      <div className="border-t border-black dark:border-gray-700 px-4 py-3 flex items-end relative gap-2">

        {/* Textarea + Send */}
        <div className="flex w-full bg-white dark:bg-black border border-black dark:border-gray-700 rounded-xl px-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-left text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 
                       resize-none py-3 pr-2 focus:outline-none truncate"
            placeholder="Say something"
            rows={1}
            style={{ minHeight: "40px", maxHeight: "200px", overflow: "auto" }}
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
