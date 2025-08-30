import React, { useEffect, useState, useRef } from "react";
import {
    SunIcon,
    MoonIcon,
    CodeBracketIcon,
    GlobeAltIcon,
    UserCircleIcon,
    SparklesIcon,
    BookOpenIcon,
} from "@heroicons/react/24/outline";
import useStore from "../../store";

const servicesData = [
    {
        id: "compiler",
        title: "Online Compiler",
        description: "Practice and run code in multiple languages.",
        icon: CodeBracketIcon,
        href: "/online-compiler",
        gif: "https://i.ibb.co/FL5Hs9k9/Screenshot-2025-08-20-at-19-54-34-Sandbox.png",
    },
    {
        id: "webdev",
        title: "WebDev Playground",
        description: "Build and preview HTML, CSS, and JS.",
        icon: GlobeAltIcon,
        href: "/webdev-playground",
        gif: "https://i.postimg.cc/G3shHYmv/Screenshot-2025-08-20-at-20-07-00-Sandbox.png",
    },
];

// Engineering Blogs JSON
const blogsData = [
    { title: "Netflix Tech Blog", href: "https://netflixtechblog.com/", desc: "Insights into Netflix engineering and systems design." },
    { title: "Uber Engineering", href: "https://eng.uber.com/", desc: "Scaling Uber's platform with cutting-edge tech." },
    { title: "Airbnb Engineering", href: "https://medium.com/airbnb-engineering", desc: "Engineering stories behind Airbnb's products." },
    { title: "Google AI Blog", href: "https://ai.googleblog.com/", desc: "Latest research and AI developments at Google." },
    { title: "Facebook Engineering", href: "https://engineering.fb.com/", desc: "Engineering challenges and innovations at Meta." },
    { title: "Amazon Builders' Library", href: "https://aws.amazon.com/builders-library/", desc: "Architecture and engineering practices at Amazon." },
    { title: "Stripe Engineering", href: "https://stripe.com/blog/engineering", desc: "Technical deep dives from the Stripe team." },
    { title: "Dropbox Tech Blog", href: "https://dropbox.tech/", desc: "Engineering, design, and infrastructure stories from Dropbox." },
];

// Official Docs JSON
const officialDocsData = [
    { title: "Java", href: "https://docs.oracle.com/javase/8/docs/" },
    { title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { title: "C", href: "https://devdocs.io/c/" },
    { title: "C++", href: "https://en.cppreference.com/w/" },
    { title: "PHP", href: "https://www.php.net/docs.php" },
    { title: "Rust", href: "https://doc.rust-lang.org/book/" },
    { title: "Go", href: "https://go.dev/doc/" },
    { title: "C#", href: "https://learn.microsoft.com/en-us/dotnet/csharp/" },
    { title: "Python", href: "https://docs.python.org/3/" },
    { title: "Ruby", href: "https://www.ruby-lang.org/en/documentation/" },
    { title: "Kotlin", href: "https://kotlinlang.org/docs/home.html" },
    { title: "Swift", href: "https://developer.apple.com/documentation/swift" },
    { title: "TypeScript", href: "https://www.typescriptlang.org/docs/" },
    { title: "HTML", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { title: "CSS", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
];

const Dashboard = () => {
    const darkMode = useStore((state) => state.darkMode);
    const setDarkModeStore = useStore((state) => state.setDarkMode);
    const profile = useStore((state) => state.profileData);

    const [greeting, setGreeting] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [quote, setQuote] = useState(null);

    // Greeting
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
    }, []);

    // Random quote
    useEffect(() => {
        const quotes = [
            { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
            { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
            { text: "Debugging is like being the detective in a crime movie where you are also the murderer.", author: "@fortes" },
        ];
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    // Close dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDarkMode = () => {
        setDarkModeStore(!darkMode);
        document.documentElement.classList.toggle("dark", !darkMode);
        localStorage.setItem("prefers-dark", String(!darkMode));
    };

    return (
        <div className="h-full w-full flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
            {/* NAVBAR */}
            <nav className="w-full flex-shrink-0 bg-gray-200 dark:bg-gray-800 h-16">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.jpg" className="h-6 w-6 rounded-md"></img>
                        <span className="font-bold text-xl tracking-tight">Sandbox</span>
                    </div>
                    <div className="flex items-center gap-4" ref={dropdownRef}>
                        <button
                            onClick={toggleDarkMode}
                            aria-label="Toggle dark mode"
                            className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                        >
                            {darkMode ? <SunIcon className="h-5 w-5 text-yellow-500" /> : <MoonIcon className="h-5 w-5 text-gray-600" />}
                        </button>
                        <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                            {profile?.profileImage ? (
                                <img
                                    src={profile.profileImage}
                                    alt="User"
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                            )}
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 top-14 w-48 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 py-2">
                                <button onClick={() => (window.location.href = "/profile")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Profile</button>
                                <button onClick={() => (window.location.href = "/settings")} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Settings</button>
                                <button onClick={() => (window.location.href = "/logout")} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col md:flex-row overflow-auto">
                {/* LEFT PANEL */}
                <div className="md:w-1/3 flex-shrink-0 p-4 flex flex-col gap-6 h-[calc(100vh-4rem)] overflow-auto">
                    {/* Official Docs */}
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
                            <BookOpenIcon className="h-6 w-6" />
                            Official Docs
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {officialDocsData.map((doc, i) => (
                                <a
                                    key={i}
                                    href={doc.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-black dark:text-white font-medium text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                                >
                                    {doc.title}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Engineering Blogs */}
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex-1 flex flex-col overflow-auto">
                        <h2 className="text-2xl font-bold text-center mb-4">Engineering Blogs</h2>
                        <div className="flex flex-col gap-3">
                            {blogsData.map((blog, i) => (
                                <a key={i} href={blog.href} target="_blank" rel="noreferrer" className="block p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                    <h3 className="text-sm font-semibold text-black dark:text-white">{blog.title}</h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{blog.desc}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="md:w-2/3 p-4 flex flex-col gap-6 h-[calc(100vh-4rem)] overflow-y-auto">
                    {/* Profile Card */}
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                        <div className="flex-shrink-0">
                            {profile?.profileImage ? (
                                <img src={profile.profileImage} alt="Profile" className="h-28 w-28 md:h-32 md:w-32 rounded-full object-cover shadow-md" />
                            ) : (
                                <UserCircleIcon className="h-28 w-28 md:h-32 md:w-32 text-gray-400 dark:text-gray-600" />
                            )}
                        </div>
                        <div className="flex-1 text-center">
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{greeting}{profile?.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}!</h1>
                            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-1">
                                Welcome to <span className="font-semibold">Sandbox</span>, your coding playground.
                            </p>
                            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                                Explore projects, try new tools, and sharpen your skills every day.
                            </p>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl md:p-8 border-2 border-gray-300 dark:border-gray-600">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-black dark:text-white mb-6">
                            Services
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {servicesData.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <div
                                        key={s.id}
                                        className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-4 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointerf"
                                        onClick={() => (window.location.href = s.href)}
                                    >
                                        <img
                                            src={s.gif}
                                            alt={`${s.title} preview`}
                                            className="w-full h-36 object-fill rounded-lg mb-3"
                                        />
                                        <Icon className="h-8 w-8 text-black dark:text-white mb-2" />
                                        <h3 className="text-lg font-semibold text-black dark:text-white mb-1">{s.title}</h3>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{s.description}</p>
                                        <button
                                            onClick={() => (window.location.href = s.href)}
                                            className="w-full py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                                        >
                                            Try Now
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Quote */}
                    {quote && (
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-3 text-center">
                            <p className="italic text-lg text-gray-700 dark:text-gray-200">“{quote.text}”</p>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">— {quote.author}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;