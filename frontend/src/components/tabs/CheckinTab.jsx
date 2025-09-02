// components/tabs/CheckinTab.jsx
import React from 'react';
import { Sparkles, Plus, Star } from 'lucide-react';
import CheckinForm from '../forms/CheckinForm';
import FoodLogForm from '../forms/FoodLogForm';

const CheckinTab = ({ openModal, closeModal }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">💖</div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Daily Wellness Check-in
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Take a moment to connect with yourself. Your mental health journey matters.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => openModal(
            <CheckinForm type="morning" onComplete={closeModal} />,
            'morning-checkin'
          )}
          className="group p-8 bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 border-2 border-transparent rounded-3xl hover:border-yellow-300 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <div className="text-center">
            <div className="text-6xl mb-4 group-hover:animate-bounce">🌅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Morning Reflection</h3>
            <p className="text-gray-600 leading-relaxed">
              Start your day with intention and self-awareness
            </p>
            <div className="mt-4 inline-flex items-center text-orange-600 font-semibold">
              <Sparkles className="h-5 w-5 mr-2" />
              Begin your day
            </div>
          </div>
        </button>
        
        <button
          onClick={() => openModal(
            <CheckinForm type="evening" onComplete={closeModal} />,
            'evening-checkin'
          )}
          className="group p-8 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 border-2 border-transparent rounded-3xl hover:border-blue-300 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <div className="text-center">
            <div className="text-6xl mb-4 group-hover:animate-bounce">🌙</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Evening Reflection</h3>
            <p className="text-gray-600 leading-relaxed">
              Reflect on your day with gratitude and mindfulness
            </p>
            <div className="mt-4 inline-flex items-center text-blue-600 font-semibold">
              <Star className="h-5 w-5 mr-2" />
              End with gratitude
            </div>
          </div>
        </button>
      </div>

      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-3xl p-8 shadow-xl">
        <div className="flex items-start space-x-6">
          <div className="text-5xl animate-pulse">🍽️</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Mindful Eating Tracker</h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Discover the connection between what you eat and how you feel. Track your meals with mindfulness and awareness.
            </p>
            <button
              onClick={() => openModal(
                <FoodLogForm onComplete={closeModal} />,
                'food-log'
              )}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="h-6 w-6 inline mr-2" />
              Log Your Meal
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-6 rounded-2xl text-center">
          <div className="text-3xl mb-2">🧘</div>
          <h4 className="font-bold text-gray-800 mb-1">Mindfulness</h4>
          <p className="text-sm text-gray-600">Stay present and aware</p>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl text-center">
          <div className="text-3xl mb-2">💪</div>
          <h4 className="font-bold text-gray-800 mb-1">Self-Care</h4>
          <p className="text-sm text-gray-600">Nurture your wellbeing</p>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-2xl text-center">
          <div className="text-3xl mb-2">🌱</div>
          <h4 className="font-bold text-gray-800 mb-1">Growth</h4>
          <p className="text-sm text-gray-600">Embrace your journey</p>
        </div>
      </div>
    </div>
  );
};

export default CheckinTab;