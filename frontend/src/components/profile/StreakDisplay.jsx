import React from 'react';
import { getStreakMilestone } from '../../utils/streakUtils';

const StreakDisplay = ({ currentStreak, longestStreak, checkInDates = [] }) => {
  const currentMilestone = getStreakMilestone(currentStreak);
  const longestMilestone = getStreakMilestone(longestStreak);

  // Generate calendar view for last 30 days
  const generateCalendarData = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (29 * 24 * 60 * 60 * 1000));
    const days = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + (i * 24 * 60 * 60 * 1000));
      const dateString = date.toDateString();
      const hasCheckIn = checkInDates.some(checkInDate => 
        new Date(checkInDate).toDateString() === dateString
      );
      
      days.push({
        date,
        hasCheckIn,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarData();

  const getNextMilestone = (streak) => {
    const milestones = [1, 3, 7, 14, 30, 50, 100, 365];
    return milestones.find(m => m > streak) || streak + 50;
  };

  const nextMilestone = getNextMilestone(currentStreak);
  const progressToNext = currentStreak > 0 ? (currentStreak / nextMilestone) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Current Streak Card */}
      <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-3xl p-8 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10">
          <div className="text-8xl font-bold mb-4 animate-pulse">
            {currentStreak}
          </div>
          <div className="text-2xl font-semibold mb-2">
            {currentStreak === 1 ? 'Day' : 'Days'}
          </div>
          <div className="flex items-center justify-center space-x-2 mb-3">
            <span className="text-4xl">{currentMilestone.emoji}</span>
            <span className="text-xl font-semibold">{currentMilestone.title}</span>
          </div>
          {currentStreak > 0 && (
            <div className="text-sm opacity-90">
              {nextMilestone - currentStreak} more days to reach the next milestone!
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-6xl opacity-20">🔥</div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-20">⚡</div>
      </div>

      {/* Progress to Next Milestone */}
      {currentStreak > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Next Milestone: {getStreakMilestone(nextMilestone).title}
            </h3>
            <span className="text-2xl">{getStreakMilestone(nextMilestone).emoji}</span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressToNext, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{currentStreak} days</span>
            <span>{nextMilestone} days</span>
          </div>
        </div>
      )}

      {/* Longest Streak */}
      {longestStreak > currentStreak && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-yellow-200 dark:border-yellow-800">
          <div className="text-center">
            <div className="text-4xl mb-2">{longestMilestone.emoji}</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
              {longestStreak} Days
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your Longest Streak
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
              {longestMilestone.title}
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          📅 Last 30 Days
        </h3>
        
        <div className="grid grid-cols-10 gap-2">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold
                ${day.hasCheckIn 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }
                ${day.isToday ? 'ring-2 ring-blue-500' : ''}
                transition-all duration-200 hover:scale-110
              `}
              title={day.date.toLocaleDateString()}
            >
              {day.hasCheckIn ? '✓' : day.date.getDate()}
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Check-in completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <span>No check-in</span>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          🏆 Achievement Badges
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 3, 7, 14, 30, 50, 100, 365].map(milestone => {
            const achieved = currentStreak >= milestone || longestStreak >= milestone;
            const milestoneData = getStreakMilestone(milestone);
            
            return (
              <div
                key={milestone}
                className={`text-center p-4 rounded-xl border-2 transition-all duration-300
                  ${achieved 
                    ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-600' 
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 opacity-50'
                  }
                `}
              >
                <div className={`text-3xl mb-2 ${achieved ? '' : 'grayscale'}`}>
                  {milestoneData.emoji}
                </div>
                <div className={`text-sm font-semibold mb-1 ${achieved ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-500'}`}>
                  {milestone} Day{milestone !== 1 ? 's' : ''}
                </div>
                <div className={`text-xs ${achieved ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'}`}>
                  {milestoneData.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StreakDisplay;