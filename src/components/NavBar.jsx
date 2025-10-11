import React, { useEffect, useRef, useState } from 'react'
import useStore from '../../store';
import { MoonIcon, SunIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const NavBar = () => {
    const darkMode = useStore((state) => state.darkMode);
    const setDarkModeStore = useStore((state) => state.setDarkMode);
    const profile = useStore((state) => state.profileData);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDarkMode = () => {
        setDarkModeStore(!darkMode);
    };

    // Close dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className='flex bg-gray-200 dark:bg-black text-gray-900 dark:text-gray-100 border-b-2 border-gray-400 dark:border-gray-600 mt-1'>
            <nav className="w-full flex-shrink-0 h-16">
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
        </div>
    )
}

export default NavBar