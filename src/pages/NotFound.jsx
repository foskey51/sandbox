import { Link } from "react-router";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-black bg-gray-100">
      <div className="text-center p-6 max-w-md mx-auto">
        <h1 className="text-6xl font-bold dark:text-gray-200 text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold dark:text-gray-200 text-gray-700 mb-4">Page Not Found</h2>
        <p className="dark:text-gray-200 text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block shadow-md dark:shadow-slate-100 border-black dark:border-white border-2 text-black dark:text-white font-medium py-2 px-4 rounded transition-colors hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;