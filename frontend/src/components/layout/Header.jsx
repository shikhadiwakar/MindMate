
import { Heart, Moon, Sun, Settings } from 'lucide-react';
// Add this import
import React, { useState } from 'react';

// Replace the Header component:
const Header = ({ darkMode, setDarkMode, user, onLogout }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 bg-opacity-80 backdrop-blur-md shadow-xl border-b border-white dark:border-gray-700 border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MindMate
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your wellness companion</p>
            </div>
          </div>
                    
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-2 bg-white dark:bg-gray-700 bg-opacity-60 rounded-xl px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.name.split(' ')[0]}
                </span>
              </div>
            )}
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-white dark:bg-gray-700 bg-opacity-60 rounded-xl hover:bg-opacity-80 transition-all"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-white dark:bg-gray-700 bg-opacity-60 rounded-xl hover:bg-opacity-80 transition-all"
                >
                  <Settings className="h-5 w-5" />
                </button>
                
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <button
                      onClick={() => {
                        onLogout();
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;