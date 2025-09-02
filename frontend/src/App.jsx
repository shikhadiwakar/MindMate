import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import EmergencyButton from './components/layout/EmergencyButton';
import Modal from './components/ui/Modal';
import AuthTab from './components/tabs/AuthTab';
import CheckinTab from './components/tabs/CheckinTab';
import ChatTab from './components/tabs/ChatTab';
import JournalTab from './components/tabs/JournalTab';
import InsightsTab from './components/tabs/InsightsTab';
import CheckinForm from './components/forms/CheckinForm';
import FoodLogForm from './components/forms/FoodLogForm';
import JournalForm from './components/forms/JournalForm';
import { MOTIVATIONAL_MESSAGES } from './utils/constants';
import { getCurrentUser } from './services/api';
import './styles/globals.css';
// Add these imports at the top
import BreathingTab from './components/tabs/BreathingTab';
import ProfileTab from './components/tabs/ProfileTab';
import { getStreakMessage } from './utils/streakUtils';

import { getUser, logout, initAuth } from './utils/auth';

const MindMateApp = () => {
  const [activeTab, setActiveTab] = useState('checkin');
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalType, setModalType] = useState('');
  
  // Authentication state
  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [authError, setAuthError] = useState(null);

  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [streakData, setStreakData] = useState(null);

  // Initialize authentication on app load
  useEffect(() => {
    const initializeAuth = async () => {
      setIsAuthChecking(true);
      setAuthError(null);
      
      try {
        if (initAuth()) {
          // Token exists and is valid, verify with server
          try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            // Token might be invalid, clear auth data
            console.error('Auth verification failed:', error);
            logout();
            setUser(null);
          }
        } else {
          // No valid token found
          const localUser = getUser();
          if (localUser) {
            // Clear invalid local data
            logout();
          }
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthError('Authentication initialization failed');
        setUser(null);
      } finally {
        setIsAuthChecking(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle successful authentication
  const handleAuthSuccess = (userData, options = {}) => {
    setUser(userData);
    setActiveTab('checkin');
    
    // Show streak popup if needed (only for login)
    if (options.showStreakPopup && options.streak > 0) {
      setStreakData({ streak: options.streak, message: getStreakMessage(options.streak) });
      setShowStreakPopup(true);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setUser(null);
    setActiveTab('checkin');
  };

  const openModal = (content, type = '') => {
    setModalContent(content);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
    setModalType('');
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'morning-checkin': return '🌅 Morning Check-in';
      case 'evening-checkin': return '🌙 Evening Check-in';
      case 'food-log': return '🍽️ Food Logger';
      case 'journal': return '📖 Journal Entry';
      case 'emergency': return '🆘 Emergency Resources';
      case 'breathing': return '🫁 Breathing Exercise';
      case 'profile': return '👤 User Profile';
      default: return 'MindMate';
    }
  };

  const tabProps = { openModal, closeModal, user };

  const renderTabContent = () => {
    if (!user) {
      return <AuthTab onAuthSuccess={handleAuthSuccess} />;
    }

    const tabProps = { openModal, closeModal, user };
    
    switch (activeTab) {
      case 'checkin': return <CheckinTab {...tabProps} />;
      case 'breathing': return <BreathingTab {...tabProps} />;
      case 'chat': return <ChatTab {...tabProps} />;
      case 'journal': return <JournalTab {...tabProps} />;
      case 'profile': return <ProfileTab {...tabProps} />;
      case 'insights': return <InsightsTab {...tabProps} />;
      default: return <CheckinTab {...tabProps} />;
    }
  };


  // Show loading screen while checking authentication
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🧠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">MindMate</h2>
          <p className="text-gray-600 mb-6">Initializing your wellness journey...</p>
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show auth error if occurred
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-6">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 ${darkMode ? 'dark' : ''}`}>
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        user={user}
        onLogout={handleLogout}
      />
      
      {user && (
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
            
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {renderTabContent()}
        </div>
      </main>

      {user && <EmergencyButton openModal={openModal} />}
            
      <Modal isOpen={showModal} onClose={closeModal} title={getModalTitle()}>
        {modalContent}
      </Modal>

      {/* Personalized Motivational Messages - Only show when authenticated */}
      {user && (
        <div className="fixed bottom-8 left-8 max-w-xs">
          <div className="bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white border-opacity-20">
            <div className="flex items-start space-x-3">
              <div className="text-2xl animate-pulse">💫</div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Hello, {user.name.split(' ')[0]}! 👋
                </p>
                <p className="text-xs text-gray-6 
                +00 leading-relaxed">
                  {MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome overlay for new users */}
      {user && !user.has_completed_onboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to MindMate!</h3>
            <p className="text-gray-600 mb-6">
              We're excited to support your mental wellness journey. Let's start with your first check-in!
            </p>
            <button
              onClick={() => {
                // You could call an API to mark onboarding as complete
                setUser(prev => ({ ...prev, has_completed_onboarding: true }));
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      // Add streak popup JSX before the closing div
      {/* Streak Popup */}
      {showStreakPopup && streakData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {streakData.streak} Day Streak!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {streakData.message}
            </p>
            <button
              onClick={() => setShowStreakPopup(false)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Amazing! 🎉
            </button>
          </div>
        </div>   
      )}


    </div>
  );
};

export default MindMateApp;