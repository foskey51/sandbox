import useStore from "../../store";
import { ArrowRight, DarkModeIcon, GitHubIcon, LightModeIcon, MouseScroll } from "../utils/Icons";
import { useState } from "react";
import LoginSignupModal from "./LoginSignupModal";

const Hero = () => {
    const store = useStore();
    const darkMode = useStore(state => state.darkMode);
    const { setDarkMode } = store;
    const [showLogin, setShowLogin] = useState(false);
    const [activeFAQ, setActiveFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setActiveFAQ((prev) => (prev === index ? null : index));
    };

    const faqs = [
        {
            question: "Do I need to install anything?",
            answer: "Nope! Everything runs in your browser. Just open Sandbox and start coding."
        },
        {
            question: "Is it free to use?",
            answer: "Yes, basic features are free forever. Pro features are available at a low cost."
        },
        {
            question: "Can I run full-stack apps?",
            answer: "Absolutely! You can build, preview, and deploy frontend and backend code directly in Sandbox."
        }
    ];


    return (
        <div>
            {/* Entire Page Wrapper */}
            <div className="w-screen text-black dark:text-white transition-colors duration-500 font-sans">

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
                                onClick={() => setShowLogin(true)}
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

                {/* Section 2: FAQ */}
                <section className="py-24 px-6 bg-neutral-50 dark:bg-neutral-950">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-14 text-gray-900 dark:text-white">
                            Frequently Asked Questions
                        </h2>

                        <div className="divide-y divide-neutral-300 dark:divide-neutral-700">
                            {faqs.map((faq, i) => (
                                <div key={i} className="py-6">
                                    <button
                                        onClick={() => toggleFAQ(i)}
                                        className="w-full flex justify-between items-center text-left"
                                    >
                                        <span className="text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-100">
                                            {faq.question}
                                        </span>
                                        <span className="ml-4 text-2xl text-neutral-500 dark:text-neutral-400">
                                            {activeFAQ === i ? '−' : '+'}
                                        </span>
                                    </button>

                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFAQ === i ? 'mt-3 max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
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

export default Hero;