import { useRef, useEffect } from "react";

const Assistant = () => {
  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Cap height (e.g., 200px)
    }
  };

  useEffect(() => {
    handleInput(); // Initial sizing
  }, []);

  return (
    <div className="flex flex-col items-center dark:bg-black dark:text-white bg-white text-black h-full overflow-auto">
      {/* Llama AI Box */}
      <div className="flex justify-center 
                      dark:bg-gray-900 dark:text-white 
                      bg-white text-black 
                      w-[90%] p-5 mt-3 
                      rounded-2xl 
                      border border-black dark:border-gray-700">
        <span className="dark:text-white text-black truncate">{`Llama AI`}</span>
      </div>

      {/* Auto-resizing Textarea */}
      <textarea
        ref={textareaRef}
        onInput={handleInput}
        className="dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 
                   bg-white text-black placeholder-gray-500 
                   mb-3 focus:outline-none text-wrap mt-auto 
                   w-[90%] border border-black dark:border-gray-700 
                   rounded-xl resize-none text-left"
        placeholder="Say something"
        rows={1}
        style={{
          minHeight: "40px",  // ~min-h-10
          maxHeight: "200px", // ~max-h-20
          overflow: "auto"
        }}
      />
    </div>
  );
};

export default Assistant;