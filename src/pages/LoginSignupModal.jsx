import React, { useState } from 'react';
import useStore from '../../store';
import axios from 'axios';

const LoginSignupModal = ({ onClose }) => {
  const store = useStore();
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const { setIsAuthenticated } = store;
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState({ username: '', password: '', confirmPassword: '', general: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const validateUsername = (u) => /^[\w.@+-]{5,}$/.test(u);
  const validatePassword = (p) => /^(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,20}$/.test(p);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    let msg = '';

    if (name === 'username') { msg = validateUsername(value) ? '' : 'Username must be at least 5 characters and contain only letters, numbers, and . _ @ + -'; }
    if (name === 'password') { msg = validatePassword(value) ? '' : 'Password must be 6-20 characters with at least one uppercase letter, one number, and one special character.'; }
    if (!isLogin && name === 'confirmPassword') {
      msg = value !== formData.password ? 'Passwords do not match' : '';
    }
    setError((e) => ({ ...e, [name]: msg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error.username || error.password || (!isLogin && error.confirmPassword)) return;

    try {
      const endpoint = isLogin ? '/auth/v1/login' : '/auth/v1/signup';
      const body = { username: formData.username, password: formData.password };
      const res = await axios.post(import.meta.env.VITE_SERVER_URL + endpoint, body, { withCredentials: false });

      if (!isLogin) {
        setSuccessMessage('Signup successful! Please login.');
        setFormData({ username: '', password: '', confirmPassword: '' });
        setError({ username: '', password: '', confirmPassword: '', general: '' });
        setIsLogin(true);
      } else {
        setSuccessMessage('Login successful!');
        setError({ username: '', password: '', confirmPassword: '', general: '' });
        setIsAuthenticated(true);
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError((e) => ({
        ...e,
        general: err.response?.data || (isLogin ? 'Login failed' : 'Signup failed'),
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md px-4">
      <div className="relative w-full max-w-md p-8 rounded-xl border border-black bg-white dark:border-gray-300 dark:bg-black">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 dark:text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-black dark:text-white">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        {error.general && (
          <p className="text-red-500 text-sm text-center mb-4">{error.general}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col text-start">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Enter username"
            />
            {error.username && <p className="text-red-500 text-xs mt-1">{error.username}</p>}
          </div>

          <div className="flex flex-col text-start">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Enter password"
            />
            {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
          </div>

          {!isLogin && (
            <div className="flex flex-col text-start">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                placeholder="Re-enter password"
              />
              {error.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{error.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have one?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError({ username: '', password: '', confirmPassword: '', general: '' });
              setSuccessMessage('');
            }}
            className="underline hover:text-black dark:hover:text-white transition-colors"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignupModal;