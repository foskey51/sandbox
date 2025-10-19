import React from 'react';
import { Atom } from 'react-loading-indicators';
import useStore from '../../store';

const Splash = () => {
    const darkMode = useStore(state => state.darkMode);

    return (
        <div className="h-screen flex flex-col items-center justify-between bg-gray-900 dark:bg-black text-white">

            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="flex items-center space-x-4">
                    <img
                        src="https://i.ibb.co/QvjNDNjg/logo.jpg"
                        alt="Logo"
                        className="w-16 h-16 object-contain rounded-xl"
                    />
                    <h1 className="text-6xl font-semibold">Sandbox</h1>
                </div>
            </div>

            <div className="mb-10">
                <Atom
                    color={darkMode ? "black" : "white"}
                    size="small"
                    text="Loading..."
                    textColor={darkMode ? "black" : "white"}
                />
            </div>
        </div>
    );
}

export default Splash;
