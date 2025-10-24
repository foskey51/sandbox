import useStore from "../../store";
import { DarkModeIcon, GitHubIcon, LightModeIcon } from "../utils/Icons";
import LoginSignupModal from "../components/LoginSignupModal";

const LandingPage = () => {
    const store = useStore();
    const darkMode = useStore((state) => state.darkMode);
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const { setDarkMode } = store;

    const githubUrl = "https://github.com/foskey51/sandbox/";

    return (
        <div className="h-screen w-screen text-black dark:text-white transition-colors duration-500 font-sans overflow-hidden relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">

            <header className="absolute top-4 w-full flex justify-between items-center px-20 py-5">
                <h1 className="text-4xl font-bold font-mono">Sandbox</h1>
                <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 border-[1.5px] border-black dark:border-gray-400 rounded-full px-4 py-2 shadow-sm">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        {darkMode ? (
                            <LightModeIcon className="w-6 h-6" />
                        ) : (
                            <DarkModeIcon className="w-6 h-6" />
                        )}
                    </button>
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        <GitHubIcon className="w-6 h-6" />
                    </a>
                </div>
            </header>

            <div className="h-full flex items-center justify-center px-24">
                <div className="grid grid-cols-2 w-full max-w-6xl gap-12">
                    <div className="flex flex-col justify-center space-y-8 pr-8">
                        <h1 className="font-bold text-5xl leading-tight">
                            Your Coding Adventure Starts in Our Sandbox
                        </h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-md">
                            Learn to code, try web development, and explore Linux — all right in here.
                        </p>
                        <div className="flex space-x-6">
                            <button
                                onClick={() => window.open(`${githubUrl}`, "_blank")}
                                className="flex items-center justify-center bg-black text-white px-7 py-3 rounded-md text-base font-semibold hover:bg-gray-700 transition dark:border-white dark:border-[1.5px]"
                            >
                                <GitHubIcon className="w-5 h-5 mr-2" />
                                Open Source
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center items-center">
                        <div className="w-full max-w-md">
                            <LoginSignupModal />
                        </div>
                    </div>
                </div>
            </div>

            <footer className="absolute bottom-0 w-full py-5 text-center text-gray-500">
                © 2025 Sandbox. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
