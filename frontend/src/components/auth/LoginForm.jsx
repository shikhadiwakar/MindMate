import React, { useState } from 'react';

const LoginForm = ({ onLogin, switchToSignup, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await onLogin(formData);
    } catch (error) {
      setErrors({ general: error.message || 'Login failed. Please try again.' });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white border-opacity-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue your mental wellness journey</p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm text-center">{errors.general}</p>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 pl-12 bg-white bg-opacity-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.email 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-purple-200 focus:ring-purple-500 focus:border-purple-500'
                }`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400">📧</span>
              </div>
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pl-12 bg-white bg-opacity-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.password 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-purple-200 focus:ring-purple-500 focus:border-purple-500'
                }`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400">🔒</span>
              </div>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        {/* Switch to Signup */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={switchToSignup}
              className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-300"
              disabled={isLoading}
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Features Preview */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl">📊</div>
              <p className="text-xs text-gray-600">Personal Insights</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">💬</div>
              <p className="text-xs text-gray-600">AI Chat Support</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">📝</div>
              <p className="text-xs text-gray-600">Mood Journal</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl">🎯</div>
              <p className="text-xs text-gray-600">Goal Tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;