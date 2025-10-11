import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

function Settings() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white dark:bg-black dark:text-white">
      <div className="text-center space-y-6">
        <WrenchScrewdriverIcon className="w-16 h-16 mx-auto text-black dark:text-blue-400" />
        <h1 className="text-3xl font-bold">Settings Under Construction</h1>
        <p className="text-lg text-black dark:text-white">
          We're working hard to bring you a fully customizable settings experience.
          Check back soon for updates!
        </p>
      </div>
    </div>
  );
}

export default Settings;