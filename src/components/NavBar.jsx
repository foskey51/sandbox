import { DarkModeIcon, LightModeIcon, PlayIcon, StopIcon, ResetIcon } from "../utils/Icons"
import useStore from "../../store";
import { useState } from "react";
import useCodeExecService from "../service/useCodeExecService";
import { useEffect, useRef } from "react";

const NavBar = () => {
    const store = useStore();
    const darkMode = useStore(state => state.darkMode);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const { setLanguageName, setDarkMode } = store;
    const languageName = useStore(state => state.languageName);
    const languageList = useStore(state => state.languageList);
    const { connect, close } = useCodeExecService();

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const renderList = (words) => {
        return (
            <div
                ref={dropdownRef}
                className="fixed top-12 right-14 z-10 dark:bg-gray-800 dark:text-white bg-white text-black border border-gray-400 rounded-md shadow-md overflow-y-auto max-h-[15rem]"
            >
                <ul>
                    {words.map((word, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                setLanguageName(word);
                                setDropdownVisible(false);
                            }}
                            className="p-1 cursor-pointer text-balance font-mono truncate ease-in-out border-b-2 border-2 dark:text-white dark:hover:bg-gray-700 text-black hover:bg-gray-100"
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
                    <button onClick={connect} >
                        <PlayIcon />
                    </button>
                    <button onClick={close}>
                        <StopIcon />
                    </button>
                    <button onClick={() => console.log("clicked reset")}>
                        <ResetIcon />
                    </button>
                </div>
                {isDropdownVisible && renderList(languageList)}
                <div className="ml-auto w-[28%] flex space-x-3 items-center justify-end relative">
                    <span className="font-mono relative z-10">Language</span>
                    <div
                        className="border-gray-400 border-[1px] w-full leading-relaxed rounded-md text-center text-sm truncate dark:bg-gray-800 dark:text-white bg-white text-black cursor-pointer"
                        onClick={() => setDropdownVisible(true)}
                    >
                        {languageName || "Select Language"}
                    </div>
                    <button onClick={toggleDarkMode}>
                        {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
                    </button>
                </div>
            </div>
        </>
    );
};

export default NavBar;