import useStore from "../../store";
import { ArrowRight, DarkModeIcon, GitHubIcon, LightModeIcon } from "../utils/Icons";
import LoginSignupModal from "../components/LoginSignupModal";

const LandingPage = () => {
    const store = useStore();
    const darkMode = useStore((state) => state.darkMode);
    const isAuthenticated = useStore((state) => state.isAuthenticated);
    const { setDarkMode } = store;

    return (
        <div className="h-screen w-screen text-black dark:text-white transition-colors duration-500 font-sans overflow-hidden relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 w-[70%] max-w-6xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg rounded-full px-8 py-3 flex items-center gap-6 z-50">
                <span className="text-xl font-semibold">Sandbox</span>
                <div className="flex ml-auto items-center space-x-4">
                    <button
                        onClick={() => window.open("https://github.com/foskey51/sandbox/", "_blank")}
                        className="p-2 hover:scale-110 transition-transform"
                    >
                        <GitHubIcon className="h-6 w-6" />
                    </button>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 hover:scale-110 transition-transform"
                    >
                        {darkMode ? (
                            <LightModeIcon className="w-6 h-6 text-white" />
                        ) : (
                            <DarkModeIcon className="w-6 h-6 text-black" />
                        )}
                    </button>
                </div>
            </div>

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
                                onClick={() =>
                                    isAuthenticated ? window.open("/dashboard", "_self") : null
                                }
                                className="flex items-center justify-center bg-yellow-700 text-white px-8 py-3 rounded-md text-base font-semibold hover:bg-yellow-600 transition"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5 ml-3" />
                            </button>
                            <button
                                onClick={() => window.open("https://github.com/foskey51/sandbox/", "_blank")}
                                className="flex items-center justify-center bg-gray-800 text-white px-7 py-3 rounded-md text-base font-semibold hover:bg-gray-700 transition"
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

            <footer className="absolute bottom-0 w-full py-5 text-center bg-neutral-100 dark:bg-neutral-950 text-sm text-neutral-600 dark:text-neutral-400">
                © 2025 Sandbox. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
