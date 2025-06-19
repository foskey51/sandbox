import React, { useState } from 'react';
import axios from 'axios';

const LoginSignupModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState({ email: '', password: '', confirmPassword: '', general: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    // Validate
    if (name === 'email') {
      setError((prev) => ({ ...prev, email: validateEmail(value) ? '' : 'Invalid email format' }));
    }
    if (name === 'password') {
      setError((prev) => ({
        ...prev,
        password: validatePassword(value)
          ? ''
          : 'Password must be at least 6 characters and include letters and numbers',
      }));
    }
    if (!isLogin && name === 'confirmPassword') {
      setError((prev) => ({
        ...prev,
        confirmPassword: value === updatedForm.password ? '' : 'Passwords do not match',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email) || !validatePassword(formData.password)) return;

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const endpoint = isLogin ? '/api/v1/login' : '/api/v1/signup';
      const res = await axios.post(endpoint, payload);

      setSuccessMessage(isLogin ? 'Login successful!' : 'Signup successful!');
      setError({ email: '', password: '', confirmPassword: '', general: '' });

      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        setTimeout(() => (window.location.href = '/dashboard'), 1500);
      } else {
        setFormData({ email: '', password: '', confirmPassword: '' });
        setIsLogin(true);
      }
    } catch (err) {
      setError((prev) => ({
        ...prev,
        general: err.response?.data?.message || (isLogin ? 'Login failed' : 'Signup failed'),
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md px-4">
      <div className="relative bg-white dark:bg-gray-800 w-full max-w-lg p-8 rounded-lg shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500"
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 8.586l4.95-4.95 1.414 1.414L11.414 10l4.95 4.95-1.414 1.414L10 11.414l-4.95 4.95-1.414-1.414L8.586 10 3.636 5.05l1.414-1.414L10 8.586z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-left text-gray-900 dark:text-white">
          {isLogin ? 'Login to your account' : 'Create an account'}
        </h2>

        {/* Messages */}
        {error.general && <p className="text-red-500 text-left mb-4">{error.general}</p>}
        {successMessage && <p className="text-green-500 text-left mb-4">{successMessage}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-white text-left">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white"
              required
            />
            {error.email && <p className="text-sm mt-2 text-red-500">{error.email}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-white text-left">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white"
              required
            />
            {error.password && <p className="text-sm mt-2 text-red-500">{error.password}</p>}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-700 dark:text-white text-left">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-white"
                required
              />
              {error.confirmPassword && <p className="text-sm mt-2 text-red-500">{error.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-300"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-300">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError({ email: '', password: '', confirmPassword: '', general: '' });
              setSuccessMessage('');
            }}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignupModal;