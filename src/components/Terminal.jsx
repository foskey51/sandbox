import { MinusIcon, PlusIcon } from "../utils/Icons";
import useStore from "../../store";

const Terminal = () => {
    const darkMode = useStore(state => state.darkMode);

    return (
        <div
            className={`w-full h-full ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-black'} transition-all duration-300 ease-linear`}
        >
            <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="font-medium">Terminal</span>
            </div>

            <div className="h-full overflow-auto p-2">
                {/* terminal content goes here */}
            </div>
        </div>
    );
}

export default Terminal;