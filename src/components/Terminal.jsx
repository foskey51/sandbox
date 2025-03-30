import useStore from "../../store";
import { MinusIcon, PlusIcon } from "../utils/Icons";

const Terminal = () => {

    const { terminalCollapsed, setTerminalCollapsed } = useStore();
    const darkMode = useStore(state => state.darkMode);

    const toggleTerminal = () => {
        setTerminalCollapsed(!terminalCollapsed);
    };
    
    return (
        <>

            <div
                className={`w-full ${darkMode? 'bg-gray-950 text-white':'bg-white text-blck'} transition-all duration-300 ease-linear ${terminalCollapsed ? "h-10" : "h-1/4"}`}
            >
                <div className="flex items-center justify-between px-4 py-2 border rounded-b-xl">
                    <span className="font-medium">Terminal</span>
                    <button
                        onClick={toggleTerminal}
                        className="e px-2 py-1 rounded"
                    >
                        {terminalCollapsed ? <PlusIcon className="size-5"/> : <MinusIcon className="size-5" />}
                    </button>
                </div>

                <div className={`h-full overflow-auto p-2 ${terminalCollapsed ? "hidden" : "block"}`}>
                    {/* terminal content goes here */}
                </div>
            </div>
        </>
    )
}

export default Terminal;