import React, { useState } from 'react';

const SignupForm = ({ onSignup, switchToLogin, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    preferences: []
  });
  const [errors, setErrors] = useState({});

  const preferenceOptions = [
    { id: 'anxiety', label: 'Anxiety Support', emoji: '😰' },
    { id: 'depression', label: 'Depression Support', emoji: '😔' },
    { id: 'stress', label: 'Stress Management', emoji: '😤' },
    { id: 'sleep', label: 'Sleep Issues', emoji: '😴' },
    { id: 'relationships', label: 'Relationships', emoji: '❤️' },
    { id: 'productivity', label: 'Productivity', emoji: '🎯' },
    { id: 'mindfulness', label: 'Mindfulness', emoji: '🧘' },
    { id: 'self_care', label: 'Self-Care', emoji: '💆' }
  ];

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

  const handlePreferenceToggle = (preferenceId) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preferenceId)
        ? prev.preferences.filter(p => p !== preferenceId)
        : [...prev.preferences, preferenceId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 13 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age (13-120)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      await onSignup(formData);
    } catch (error) {
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white border-opacity-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Join MindMate</h2>
          <p className="text-gray-600">Start your personalized mental wellness journey</p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm text-center">{errors.general}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 pl-12 bg-white bg-opacity-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.name 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-purple-200 focus:ring-purple-500 focus:border-purple-500'
                }`}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400">👤</span>
              </div>
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

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

          {/* Age Field */}
          <div>
            <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
              Age
            </label>
            <div className="relative">
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="13"
                max="120"
                className={`w-full px-4 py-3 pl-12 bg-white bg-opacity-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.age 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-purple-200 focus:ring-purple-500 focus:border-purple-500'
                }`}
                placeholder="Your age"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400">🎂</span>
              </div>
            </div>
            {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
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
                placeholder="Create a password"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400">🔒</span>
              </div>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 pl-12 bg-white bg-opacity-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.confirmPassword 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-purple-200 focus:ring-purple-500 focus:border-purple-500'
                }`}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400">🔐</span>
              </div>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* Preferences */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Areas of Interest (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {preferenceOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handlePreferenceToggle(option.id)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    formData.preferences.includes(option.id)
                      ? 'bg-purple-100 border-2 border-purple-300 text-purple-700'
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                  disabled={isLoading}
                >
                  <div className="text-lg mb-1">{option.emoji}</div>
                  <div>{option.label}</div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Select areas you'd like personalized support with
            </p>
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
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </div>

        {/* Switch to Login */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={switchToLogin}
              className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-300"
              disabled={isLoading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;