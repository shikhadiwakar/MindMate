import React, { useState } from 'react';
import LoginForm from '../auth/LoginForm';
import SignupForm from '../auth/SignupForm';
import { login, signup } from '../../services/api';
import { calculateStreak, getStreakMessage, shouldShowStreakPopup } from '../../utils/streakUtils';

const AuthTab = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [isLoading, setIsLoading] = useState(false);

// Add this import at the top


  // Replace the handleLogin function:
  const handleLogin = async (formData) => {
    setIsLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      // Store token and user data
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Calculate streak and show popup for login only
      const userCheckIns = response.user.check_in_dates || [];
      const currentStreak = calculateStreak(userCheckIns);
      const lastShownStreak = parseInt(localStorage.getItem('lastShownStreak') || '0');
      
      if (shouldShowStreakPopup(currentStreak, lastShownStreak)) {
        localStorage.setItem('lastShownStreak', currentStreak.toString());
        // Trigger streak popup after successful auth
        setTimeout(() => {
          onAuthSuccess(response.user, { showStreakPopup: true, streak: currentStreak });
        }, 500);
      } else {
        onAuthSuccess(response.user);
      }
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (formData) => {
    setIsLoading(true);
    try {
      const response = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        preferences: formData.preferences
      });
      // Store token and user data
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onAuthSuccess(response.user);
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSignup = () => setMode('signup');
  const switchToLogin = () => setMode('login');

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {mode === 'login' ? (
            <LoginForm
              onLogin={handleLogin}
              switchToSignup={switchToSignup}
              isLoading={isLoading}
            />
          ) : (
            <SignupForm
              onSignup={handleSignup}
              switchToLogin={switchToLogin}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Bottom Info */}
        <div className="mt-12 text-center">
          <div className="bg-white bg-opacity-60 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-30">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🌟 Why Choose MindMate?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="space-y-2">
                <div className="text-2xl">🔒</div>
                <p className="font-medium">Privacy First</p>
                <p>Your data is encrypted and secure</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">🤖</div>
                <p className="font-medium">AI-Powered</p>
                <p>Personalized insights and support</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">📈</div>
                <p className="font-medium">Track Progress</p>
                <p>Monitor your mental wellness journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTab;