import useStore from "../../store";
import { ArrowRight, DarkModeIcon, GitHubIcon, LightModeIcon, MouseScroll } from "../utils/Icons";
import { useState } from "react";
import LoginSignupModal from "../components/LoginSignupModal";

const LandingPage = () => {
    const store = useStore();
    const darkMode = useStore(state => state.darkMode);
    const isAuthenticated = useStore(state => state.isAuthenticated);
    const { setDarkMode } = store;
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div>
            {/* Entire Page Wrapper */}
            <div className="h-screen w-screen text-black dark:text-white transition-colors duration-500 font-sans overflow-auto">

                {/* Navbar */}
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-4/5 dark:shadow-slate-100 dark:shadow-sm bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg rounded-full px-6 py-3 flex gap-4 z-50">
                    <span className="text-lg font-semibold">Sandbox</span>
                    <div className="flex ml-auto space-x-2">
                        <button
                            onClick={() => window.open("https://github.com/foskey51/sandbox/", "_blank")}
                            className="ml-auto p-1 hover:scale-110 transition-transform"
                        >
                            <GitHubIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="ml-auto p-1 hover:scale-110 transition-transform"
                        >
                            {darkMode ? (
                                <LightModeIcon className="w-5 h-5 text-white" />
                            ) : (
                                <DarkModeIcon className="w-5 h-5 text-black" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Section 1: Hero */}
                <section className="relative min-h-screen flex items-center justify-center text-center px-4 sm:px-6 bg-gradient-to-t from-gray-50 to-gray-50 dark:from-gray-900 dark:to-black">
                    <div className="flex flex-col space-y-6 max-w-3xl w-full">
                        <h1 className="font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight">
                            Your Coding Adventure Starts in Our Sandbox
                        </h1>
                        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                            Learn to code, try web dev, and explore Linux all in your browser.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-4 space-y-3 sm:space-y-0">
                            <button
                                onClick={() => isAuthenticated ? window.open("/dashboard","_self") : setShowLogin(true)}
                                className="flex items-center justify-center bg-yellow-700 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4 ml-3" />
                            </button>
                            {showLogin && <LoginSignupModal onClose={() => setShowLogin(false)} />}
                            <button
                                onClick={() => window.open("https://github.com/foskey51/sandbox/", "_blank")}
                                className="flex items-center justify-center bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-600 transition"
                            >
                                <GitHubIcon className="w-5 h-5 mr-2" />
                                Open Source
                            </button>
                        </div>
                    </div>
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                        <MouseScroll />
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-6 text-center bg-neutral-100 dark:bg-neutral-950 text-sm text-neutral-600 dark:text-neutral-400">
                    © 2025 Sandbox. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;