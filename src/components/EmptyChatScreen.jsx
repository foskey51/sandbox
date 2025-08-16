import React, { useEffect } from "react";
import useStore from "../../store";

export default function EmptyChatScreen() {
  const { setChatboxInput } = useStore();

  useEffect(() => {
    setChatboxInput("");
  }, []);

  const suggestions = [
    "Explain this code snippet",
    "Debug my JavaScript function",
    "Teach me Rust programming",
    "What is concurrency and parallelism",
    "Help me understand recursion",
    "Convert code from Java to Python",
  ];

  return (
    <div className="flex flex-col w-full h-full items-center justify-center text-center px-4 py-6 bg-white dark:bg-black text-black dark:text-gray-200 overflow-auto">
      {/* Title */}
      <h1 className="text-lg sm:text-xl font-semibold">Welcome to Sandbox</h1>
      <p className="mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        Your AI coding assistant. Ask me anything!
      </p>

      {/* Suggestions */}
      <div className="mt-8 space-y-3 max-w-xs w-full">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => setChatboxInput(s)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 
              px-3 py-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 
              hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Footer tip */}
      <p className="mt-10 text-xs text-gray-400 dark:text-gray-500">
        💡 Tip: Paste code and ask Sandbox to explain or debug.
      </p>
    </div>
  );
}