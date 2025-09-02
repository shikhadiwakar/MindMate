import React, { useState, useEffect } from 'react';
import UserStats from '../profile/UserStats';
import StreakDisplay from '../profile/StreakDisplay';

const ProfileTab = ({ user, openModal }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [userStats, setUserStats] = useState({
    totalCheckIns: 0,
    currentStreak: 0,
    longestStreak: 0,
    journalEntries: 0,
    breathingSessions: 0,
    averageMood: 0,
    checkInDates: [],
    joinedDate: new Date()
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate fetching user stats
    const mockStats = {
      totalCheckIns: 45,
      currentStreak: 12,
      longestStreak: 28,
      journalEntries: 23,
      breathingSessions: 18,
      averageMood: 7.2,
      checkInDates: [
        // Mock recent check-in dates
        ...Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString();
        })
      ],
      joinedDate: new Date('2024-01-15')
    };
    
    setUserStats(mockStats);
  }, []);

  const sections = [
    { id: 'overview', name: 'Overview', icon: '👤' },
    { id: 'streaks', name: 'Streaks & Progress', icon: '🔥' },
    { id: 'insights', name: 'Insights', icon: '📊' }
  ];

  const formatMemberSince = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* User Profile Card */}
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
            <span className="text-6xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <p className="text-xl opacity-90 mb-4">{user.email}</p>
            <div className="space-y-2">
              <div className="text-sm opacity-80">
                Member since {formatMemberSince(userStats.joinedDate)}
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🔥</span>
                  <span className="font-semibold">{userStats.currentStreak} day streak</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">✅</span>
                  <span className="font-semibold">{userStats.totalCheckIns} check-ins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <UserStats user={user} stats={userStats} />
    </div>
  );

  const renderStreaks = () => (
    <StreakDisplay 
      currentStreak={userStats.currentStreak}
      longestStreak={userStats.longestStreak}
      checkInDates={userStats.checkInDates}
    />
  );

  const renderInsights = () => (
    <div className="space-y-6">
      {/* Mood Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          😊 Mood Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              {userStats.averageMood.toFixed(1)}/10
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Mood</div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Great Days (8+)</span>
              <span className="font-semibold text-green-600">65%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Good Days (6-7)</span>
              <span className="font-semibold text-blue-600">25%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Difficult Days (&lt;6)</span>
              <span className="font-semibold text-orange-600">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          📈 Activity Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-xl">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {userStats.journalEntries}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Journal Entries</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {(userStats.journalEntries / Math.max(userStats.totalCheckIns, 1) * 100).toFixed(0)}% of check-ins
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-xl">
            <div className="text-3xl mb-2">🧘‍♀️</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {userStats.breathingSessions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Breathing Sessions</div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Stress management
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-xl">
            <div className="text-3xl mb-2">💪</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(userStats.currentStreak / 7 * 10) / 10}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Consistency Score</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              Weekly average
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          💡 Personalized Recommendations
        </h3>
        
        <div className="space-y-4">
          {userStats.averageMood < 6 && (
            <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl">
              <span className="text-2xl">🌟</span>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Focus on Mood Boosting Activities
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your average mood could use a boost. Try incorporating more breathing exercises 
                  and positive journaling into your routine.
                </p>
              </div>
            </div>
          )}
          
          {userStats.breathingSessions < userStats.totalCheckIns * 0.3 && (
            <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl">
              <span className="text-2xl">🧘‍♀️</span>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Try More Breathing Exercises
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Breathing exercises can significantly reduce stress. Aim for at least 
                  one session per check-in.
                </p>
              </div>
            </div>
          )}
          
          {userStats.currentStreak >= 7 && (
            <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl">
              <span className="text-2xl">🎉</span>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Amazing Consistency!
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You're building an excellent wellness habit. Keep up the great work!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          👤 Your Profile
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Track your wellness journey, celebrate your progress, and gain insights into your mental health patterns.
        </p>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap justify-center gap-4">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300
              ${activeSection === section.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <span className="text-lg">{section.icon}</span>
            <span>{section.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'streaks' && renderStreaks()}
        {activeSection === 'insights' && renderInsights()}
      </div>
    </div>
  );
};

export default ProfileTab;