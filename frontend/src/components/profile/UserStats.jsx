import React from 'react';

const UserStats = ({ user, stats }) => {
  const defaultStats = {
    totalCheckIns: 0,
    currentStreak: 0,
    longestStreak: 0,
    journalEntries: 0,
    breathingSessions: 0,
    totalDays: 0,
    averageMood: 0,
    ...stats
  };

  const statCards = [
    {
      title: 'Current Streak',
      value: defaultStats.currentStreak,
      unit: 'days',
      icon: '🔥',
      color: 'from-orange-400 to-red-500',
      description: 'Consecutive days of check-ins'
    },
    {
      title: 'Longest Streak',
      value: defaultStats.longestStreak,
      unit: 'days',
      icon: '🏆',
      color: 'from-yellow-400 to-orange-500',
      description: 'Your personal best'
    },
    {
      title: 'Total Check-ins',
      value: defaultStats.totalCheckIns,
      unit: '',
      icon: '✅',
      color: 'from-green-400 to-teal-500',
      description: 'Times you\'ve logged your mood'
    },
    {
      title: 'Journal Entries',
      value: defaultStats.journalEntries,
      unit: '',
      icon: '📝',
      color: 'from-blue-400 to-purple-500',
      description: 'Thoughts and reflections shared'
    },
    {
      title: 'Breathing Sessions',
      value: defaultStats.breathingSessions,
      unit: '',
      icon: '🧘‍♀️',
      color: 'from-purple-400 to-pink-500',
      description: 'Mindful breathing practices'
    },
    {
      title: 'Average Mood',
      value: defaultStats.averageMood.toFixed(1),
      unit: '/10',
      icon: '😊',
      color: 'from-pink-400 to-rose-500',
      description: 'Your overall mood trend'
    }
  ];

  const getMoodEmoji = (score) => {
    if (score >= 8) return '😄';
    if (score >= 6) return '😊';
    if (score >= 4) return '😐';
    if (score >= 2) return '😞';
    return '😢';
  };

  const getStreakMessage = (streak) => {
    if (streak === 0) return "Ready to start your wellness journey? 🌱";
    if (streak < 7) return "Building momentum! Keep it up! 💪";
    if (streak < 30) return "You're on fire! Great consistency! 🔥";
    if (streak < 100) return "Incredible dedication! You're a wellness champion! 🏆";
    return "You're a wellness legend! Absolutely amazing! 👑";
  };

  return (
    <div className="space-y-6">
      {/* Streak Highlight */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white text-center">
        <div className="text-6xl font-bold mb-2">{defaultStats.currentStreak}</div>
        <div className="text-xl font-semibold mb-1">Day Streak</div>
        <div className="text-sm opacity-90">{getStreakMessage(defaultStats.currentStreak)}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white text-xs font-semibold`}>
                {stat.title}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                {stat.title === 'Average Mood' ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span>{getMoodEmoji(parseFloat(stat.value))}</span>
                    <span>{stat.value}{stat.unit}</span>
                  </span>
                ) : (
                  `${stat.value}${stat.unit}`
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          📈 Your Progress Insights
        </h3>
        
        <div className="space-y-3">
          {defaultStats.currentStreak > 0 && (
            <div className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">✨</span>
              <div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  You've maintained consistency for <strong>{defaultStats.currentStreak} days</strong>! 
                  {defaultStats.currentStreak >= 7 && " You're building a powerful wellness habit."}
                </span>
              </div>
            </div>
          )}
          
          {defaultStats.averageMood > 6 && (
            <div className="flex items-start space-x-2">
              <span className="text-yellow-500 mt-1">🌟</span>
              <div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Your average mood is <strong>{defaultStats.averageMood.toFixed(1)}/10</strong> - 
                  you're doing great at maintaining positive mental health!
                </span>
              </div>
            </div>
          )}
          
          {defaultStats.journalEntries > 0 && (
            <div className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">📝</span>
              <div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  You've written <strong>{defaultStats.journalEntries} journal entries</strong> - 
                  self-reflection is a powerful tool for growth!
                </span>
              </div>
            </div>
          )}
          
          {defaultStats.breathingSessions > 0 && (
            <div className="flex items-start space-x-2">
              <span className="text-purple-500 mt-1">🧘‍♀️</span>
              <div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  You've completed <strong>{defaultStats.breathingSessions} breathing sessions</strong> - 
                  excellent work on managing stress and finding calm!
                </span>
              </div>
            </div>
          )}
          
          {defaultStats.totalCheckIns === 0 && (
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-1">🌱</span>
              <div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Welcome to your wellness journey! Start with a daily check-in to track your progress.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStats;