import React from 'react';
import { Brain, Zap } from 'lucide-react';

const InsightsTab = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">📊</div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Your Wellness Insights
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Understand your patterns, celebrate progress, and discover what works best for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Mood Patterns</h3>
            <div className="text-3xl">📈</div>
          </div>
          <div className="bg-white rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">7.2</div>
                <div className="text-sm text-gray-500">Average mood this week</div>
                <div className="text-xs text-green-600 mt-1">↗️ +0.8 from last week</div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Your mood has been trending upward. Keep up the great work!</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Mindful Eating</h3>
            <div className="text-3xl">🧘</div>
          </div>
          <div className="bg-white rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">8.4</div>
                <div className="text-sm text-gray-500">Mindfulness score</div>
                <div className="text-xs text-green-600 mt-1">🎯 Excellent progress</div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">You're becoming more mindful with your eating habits!</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Check-in Streak</h3>
            <div className="text-3xl">🔥</div>
          </div>
          <div className="bg-white rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">12</div>
                <div className="text-sm text-gray-500">Days in a row</div>
                <div className="text-xs text-purple-600 mt-1">🌟 Amazing consistency!</div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Consistency is key to mental wellness. You're doing great!</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Stress Levels</h3>
            <div className="text-3xl">😌</div>
          </div>
          <div className="bg-white rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">4.1</div>
                <div className="text-sm text-gray-500">Average stress level</div>
                <div className="text-xs text-green-600 mt-1">↘️ -1.3 from last week</div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Your stress levels are decreasing. Great job managing stress!</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 rounded-3xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Zap className="h-8 w-8 mr-3 text-indigo-600" />
          Personalized Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">🥗</div>
              <h4 className="text-lg font-bold text-gray-800">Mood-Boosting Foods</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Based on your patterns, these foods help improve your mood and energy.
            </p>
            <div className="space-y-2">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs inline-block mr-2">Avocados</div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs inline-block mr-2">Blueberries</div>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs inline-block">Dark Chocolate</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">🧘</div>
              <h4 className="text-lg font-bold text-gray-800">Mindfulness Practices</h4>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Personalized practices to help you feel more centered and calm.
            </p>
            <div className="space-y-2">
              <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs inline-block mr-2">5-min Meditation</div>
              <div className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs inline-block mr-2">Gratitude Practice</div>
              <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs inline-block">Breathing Exercise</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsTab;