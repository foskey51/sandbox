import Assistant from "../components/Assistant";
import NavBar from "../components/NavBar";
import Split from "react-split";
import MonacoEditor from "../components/MonacoEditor";
import TerminalView from "../components/TerminalView";
import Sidebar from "../components/Sidebar";

const OnlineCompiler = () => {

  return (
    <div className="flex h-screen w-screen overflow-auto bg-white dark:bg-[#0D1117]">
      <Sidebar />

      {/* Assistant Panel */}
      <div className="flex flex-col h-full w-full overflow-hidden">
        <Split
          className="flex h-full"
          sizes={[25, 75]}
          minSize={200}
          gutterSize={4}
          direction="horizontal"
          gutter={() => {
            const gutter = document.createElement('div');
            gutter.className = "bg-gray-300 hover:bg-gray-400 dark:bg-[#1F2937] dark:hover:bg-gray-600 transition-all duration-200 cursor-col-resize";
            return gutter;
          }}
        >
          <div className="h-full overflow-hidden p-2 flex flex-col min-h-0">
            <Assistant />
          </div>

          {/* Right side: NavBar + Editor + Terminal */}
          <div className="flex flex-col h-full w-full">

            <NavBar />

            {/* Editor and Terminal Split */}
            <Split
              className="flex flex-col w-full h-full flex-1"
              sizes={[60, 40]}
              minSize={180}
              gutterSize={3}
              direction="vertical"
              gutter={() => {
                const gutter = document.createElement('div');
                gutter.className = "bg-gray-300 hover:bg-gray-400 dark:bg-[#1F2937] dark:hover:bg-gray-600 transition-all duration-200 cursor-row-resize";
                return gutter;
              }}
            >
              {/* Editor */}
              <div className="h-full w-full overflow-auto p-2 border-b">
                <MonacoEditor />
              </div>

              {/* Terminal */}
              <div className="h-full w-full flex-col overflow-hidden p-2">
                <TerminalView />
              </div>
            </Split>
          </div>
        </Split>
      </div>
    </div>
  );
};

export default OnlineCompiler;