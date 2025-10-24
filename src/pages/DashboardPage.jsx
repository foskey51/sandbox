import React, { useEffect, useState } from "react";
import { UserCircleIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import useStore from "../../store";
import NavBar from "../components/NavBar";

const servicesData = [
    {
        id: "compiler",
        title: "Online Compiler",
        description: "Practice and run code in multiple languages",
        href: "/online-compiler",
    },
    {
        id: "webdev",
        title: "WebDev Playground",
        description: "Build and preview HTML, CSS, and JS",
        href: "/webdev-playground",
    },
    {
        id: "virtual-machine",
        title: "Virtual Machine",
        description: "Play with Linux without any worry",
        href: "/webdev-playground",
    },
];

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

const DashboardPage = () => {
    const profile = useStore((state) => state.profileData);
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 18) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
    }, []);

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors">
            <NavBar />

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Sidebar */}
                <div className="md:w-1/3 flex flex-col gap-4 p-4 overflow-y-auto">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col flex-grow">
                        <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
                            <BookOpenIcon className="h-6 w-6" />
                            Official Docs
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-grow">
                            {officialDocsData.map((doc, i) => (
                                <a
                                    key={i}
                                    href={doc.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-black dark:text-white font-medium text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm truncate"
                                >
                                    {doc.title}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col flex-grow overflow-auto">
                        <h2 className="text-2xl font-bold text-center mb-4">Engineering Blogs</h2>
                        <div className="flex flex-col gap-3 flex-grow">
                            {blogsData.map((blog, i) => (
                                <a
                                    key={i}
                                    href={blog.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <h3 className="text-sm font-semibold text-black dark:text-white">{blog.title}</h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{blog.desc}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="md:w-2/3 flex flex-col gap-4 p-4 overflow-y-auto">
                    {/* Greeting Section */}
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 flex-shrink-0">
                        <div className="flex-shrink-0">
                            {profile?.profileImage ? (
                                <img
                                    src={profile.profileImage}
                                    alt="Profile"
                                    className="h-28 w-28 md:h-32 md:w-32 rounded-full object-cover shadow-md"
                                />
                            ) : (
                                <UserCircleIcon className="h-28 w-28 md:h-32 md:w-32 text-gray-400 dark:text-gray-600" />
                            )}
                        </div>
                        <div className="flex-1 text-center">
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                                {greeting}
                                {profile?.fullName
                                    ? `, ${profile.fullName.split(" ")[0]}`
                                    : ""}
                                !
                            </h1>
                            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-1">
                                Welcome to <span className="font-semibold">Sandbox</span>,
                                your coding playground.
                            </p>
                            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                                Explore programming and sharpen your skills every day.
                            </p>
                        </div>
                    </div>

                    {/* Services - Full Height, Dark Mode Optimized */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8 border-2 border-black dark:border-white flex flex-col h-full">
                        <h2 className="text-3xl md:text-4xl font-bold text-center font-serif leading-loose text-black dark:text-white mb-6">
                            What You Can Do !!
                        </h2>
                        <div className="flex flex-col justify-between flex-grow gap-5">
                            {servicesData.map((s) => (
                                <div
                                    key={s.id}
                                    className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:bg-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-300 cursor-pointer flex-grow"
                                    onClick={() => (window.location.href = s.href)}
                                >
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                                            {s.title}
                                        </h3>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {s.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => (window.location.href = s.href)}
                                        className="mt-4 sm:mt-0 sm:ml-4 py-2 px-6 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 shadow"
                                    >
                                        Try Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Analytics Coming Soon */}
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center flex-shrink-0">
                        <h3 className="text-xl font-bold mb-1">
                            Analytics Coming Soon
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Track your coding activity and performance right here soon.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
