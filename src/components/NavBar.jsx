import { DarkModeIcon, LightModeIcon, PlayIcon, StopIcon, ResetIcon } from "../utils/Icons"
import useStore from "../../store";
import { useState } from "react";
import useCodeExecService from "../service/useCodeExecService";

const NavBar = () => {
    const store = useStore();
    const darkMode = useStore(state => state.darkMode);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const { setLanguageName, setDarkMode } = store;
    const languageName = useStore(state => state.languageName);
    const languageList = useStore(state => state.languageList);
    const { connect, close } = useCodeExecService();

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const renderList = (words) => {
        return (
            <div className="fixed top-12 right-16 z-10 dark:bg-gray-800 dark:text-white bg-white text-black border border-gray-400 rounded-md shadow-md">
                <ul>
                    {words.map((word, index) => (
                        <li
                            key={index}
                            onClick={() => { setLanguageName(word); }}
                            className="p-1 cursor-pointer truncate ease-in-out dark:text-white dark:hover:bg-gray-700 text-black hover:bg-gray-100"
                        >
                            {word}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <>
            <div className="flex p-4 dark:bg-black dark:text-white bg-white text-black">
                <span className="text-xl font-mono font-semibold">Sandbox</span>
                <div className="flex ml-auto left-1/2 transform translate-x-1/2 mt-1 space-x-4">
                    <div
                        onClick={() => {
                            connect();
                        }}>
                        <PlayIcon />
                    </div>

                    <div
                        onClick={() => {
                            close();
                        }}>
                        <StopIcon />
                    </div>

                    <div
                        onClick={() => {
                            console.log("clicked reset");
                        }}>
                        <ResetIcon />
                    </div>
                </div>
                {isDropdownVisible && renderList(languageList)}
                <div className="ml-auto flex space-x-3 items-center justify-end relative">
                    <span className="font-mono relative z-10">Language</span>
                    <input
                        className="border-gray-400 border-[1px] w-[40%] rounded-md text-center focus:outline-none text-sm truncate dark:bg-gray-800 dark:text-white bg-white text-black"
                        type="text"
                        placeholder={languageName}
                        value={languageName}
                        onFocus={() => {
                            setDropdownVisible(true);
                        }}
                        onBlur={() => {
                            setTimeout(() => setDropdownVisible(false), 200);
                        }}
                        readOnly={true}
                    />
                    <button onClick={toggleDarkMode}>
                        {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
                    </button>
                </div>
            </div>
        </>
    );
};

export default NavBar;