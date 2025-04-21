import { DarkModeIcon, LightModeIcon, PlayIcon, StopIcon, ResetIcon } from "../utils/Icons"
import useStore from "../../store";
import { useState, useEffect } from "react";

const NavBar = () => {
    const store = useStore();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const { setLanguageName, setDarkMode } = store;
    const darkMode = useStore(state => state.darkMode);
    const languageName = useStore(state => state.languageName);
    const languageList = useStore(state => state.languageList);

    const toggleDarkMode = () => {
        const newDarkValue = !darkMode;

        localStorage.setItem('theme', newDarkValue ? 'dark' : 'light');

        if (newDarkValue) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        setDarkMode(newDarkValue);
    };

    const renderList = (words) => {
        return (
            <div className={`fixed top-9 right-13 z-10 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border border-gray-400 rounded-md shadow-md`}>
                <ul>
                    {words.map((word, index) => (
                        <li
                            key={index}
                            onClick={() => { setLanguageName(word); }}
                            className={`p-1 cursor-pointer truncate ease-in-out ${darkMode ? 'text-white hover:bg-gray-700' : 'text-black hover:bg-gray-100'}`}
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
            <div className={`flex p-2 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <span className="text-lg font-mono font-semibold">Sandbox</span>
                <div className="flex ml-auto mt-1 space-x-4">
                    <PlayIcon />
                    <StopIcon />
                    <ResetIcon />
                </div>
                {isDropdownVisible && renderList(languageList)}
                <div className="ml-auto flex space-x-4 items-center justify-items-center relative">
                    <span className="font-mono mr-2 relative z-10">Language</span>
                    <input
                        className={`border-gray-400 border-[1px] w-25 rounded-md text-center focus:outline-none text-sm truncate ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
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