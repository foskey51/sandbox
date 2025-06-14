import useStore from "../../store";

const Terminal = () => {
    return (
        <div className="w-full h-full bg-white text-black dark:bg-gray-950 dark:text-white transition-all duration-300 ease-linear">
            <div className="flex items-center justify-between px-4 py-2 border-b border-black dark:border-white">
                <span className="font-medium">Terminal</span>
            </div>

            <div className="h-full overflow-auto p-2">
                {/* terminal content goes here */}
            </div>
        </div>
    );
};

export default Terminal;