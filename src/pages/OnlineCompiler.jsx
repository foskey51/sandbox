import Assistant from "../components/Assistant";
import Editor from "../components/MonacoEditor";
import Terminal from "../components/Terminal";
import NavBar from "../components/NavBar";
import Split from "react-split";
import useStore from "../../store";
import MonacoEditor from "../components/MonacoEditor";

const OnlineCompiler = () => {
  const darkMode = useStore(state => state.darkMode);

  return (
    <div className={`h-screen w-screen overflow-hidden flex ${darkMode ? "bg-[#0D1117]" : "bg-white"}`}>
      {/* Assistant Panel */}
      <div className="flex flex-col h-full w-full">
        <Split
          className="flex h-full"
          sizes={[20, 80]}
          minSize={200}
          gutterSize={4} 
          direction="horizontal"
          gutter={() => {
            const gutter = document.createElement('div');
            gutter.className = `${darkMode 
              ? "bg-[#1F2937] hover:bg-gray-600"
              : "bg-gray-300 hover:bg-gray-400"
            } transition-all duration-200 cursor-col-resize`;
            return gutter;
          }}
        >
          {/* Left side: Assistant */}
          <div className="h-full overflow-auto p-2">
            <Assistant />
          </div>

          {/* Right side: NavBar + Editor + Terminal */}
          <div className="flex flex-col h-full">

            <NavBar />

            {/* Editor and Terminal Split */}
            <Split
              className="flex flex-col w-full flex-1"
              sizes={[70, 30]}
              minSize={70}
              gutterSize={3}
              direction="vertical"
              gutter={() => {
                const gutter = document.createElement('div');
                gutter.className = `${darkMode 
                  ? "bg-[#1F2937] hover:bg-gray-600"
                  : "bg-gray-300 hover:bg-gray-400"
                } transition-all duration-200 cursor-row-resize`;
                return gutter;
              }}
            >
              {/* Editor */}
              <div className="h-full overflow-auto p-2 border-b">
                <MonacoEditor />
              </div>

              {/* Terminal */}
              <div className="h-full overflow-auto p-2">
                <Terminal />
              </div>
            </Split>
          </div>
        </Split>
      </div>
    </div>
  );
};

export default OnlineCompiler;