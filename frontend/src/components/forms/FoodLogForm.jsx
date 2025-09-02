// components/forms/FoodLogForm.jsx
import React, { useState } from 'react';
import AnimatedSlider from '../ui/AnimatedSlider';
import { api } from '../../services/api';
import { MEAL_EMOJIS } from '../../utils/constants';

const FoodLogForm = ({ onComplete }) => {
  const [mealType, setMealType] = useState('breakfast');
  const [foodItems, setFoodItems] = useState('');
  const [hungerBefore, setHungerBefore] = useState(5);
  const [hungerAfter, setHungerAfter] = useState(5);
  const [emotionsBefore, setEmotionsBefore] = useState('');
  const [emotionsAfter, setEmotionsAfter] = useState('');
  const [mindfulScore, setMindfulScore] = useState(5);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.createFoodLog({
        meal_type: mealType,
        food_name: foodItems.split(',').map(item => item.trim()).filter(Boolean)[0] || "Unknown",  // ✅ required
        food_items: foodItems.split(',').map(item => item.trim()).filter(Boolean),
        hunger_before: hungerBefore,
        hunger_after: hungerAfter,
        emotions_before: emotionsBefore.split(',').map(e => e.trim()).filter(Boolean),
        emotions_after: emotionsAfter.split(',').map(e => e.trim()).filter(Boolean),
        mindful_eating_score: mindfulScore,
        notes: notes || null,
      });


      setSuccess(true);
      setTimeout(() => onComplete(), 2000);
    } catch (error) {
      console.error('Failed to log food:', error);
      alert('Failed to log food. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="animate-bounce text-6xl mb-4">🍽️</div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Food Logged Successfully!</h3>
        <p className="text-gray-600">Great job tracking your mindful eating journey.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 rounded-2xl">
      <div className="text-center">
        <div className="text-4xl mb-2">{MEAL_EMOJIS[mealType]}</div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Food & Mood Tracker
        </h3>
        <p className="text-gray-600 mt-2">Track how food affects your wellbeing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white bg-opacity-60 p-4 rounded-xl">
          <label className="block text-sm font-semibold text-gray-700 mb-3">🍽️ Meal Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(MEAL_EMOJIS).map(([type, emoji]) => (
              <button
                key={type}
                type="button"
                onClick={() => setMealType(type)}
                className={`p-3 rounded-xl transition-all ${
                  mealType === type
                    ? 'bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-lg scale-105'
                    : 'bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700'
                }`}
              >
                <div className="text-xl">{emoji}</div>
                <div className="text-xs font-medium capitalize">{type}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white bg-opacity-60 p-4 rounded-xl">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            🥗 What did you eat?
          </label>
          <textarea
            value={foodItems}
            onChange={(e) => setFoodItems(e.target.value)}
            className="w-full p-4 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-green-200 transition-all placeholder-gray-400"
            rows={3}
            placeholder="e.g., avocado toast, coffee, scrambled eggs"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-60 p-4 rounded-xl">
            <AnimatedSlider
              label="😋 Hunger Before"
              value={hungerBefore}
              onChange={setHungerBefore}
              color="orange"
            />
          </div>
          <div className="bg-white bg-opacity-60 p-4 rounded-xl">
            <AnimatedSlider
              label="😌 Hunger After"
              value={hungerAfter}
              onChange={setHungerAfter}
              color="green"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-60 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              💭 Emotions Before
            </label>
            <input
              type="text"
              value={emotionsBefore}
              onChange={(e) => setEmotionsBefore(e.target.value)}
              className="w-full p-3 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-blue-200 transition-all placeholder-gray-400"
              placeholder="stressed, excited, tired"
            />
          </div>
          <div className="bg-white bg-opacity-60 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ✨ Emotions After
            </label>
            <input
              type="text"
              value={emotionsAfter}
              onChange={(e) => setEmotionsAfter(e.target.value)}
              className="w-full p-3 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-blue-200 transition-all placeholder-gray-400"
              placeholder="satisfied, energized, calm"
            />
          </div>
        </div>

        <div className="bg-white bg-opacity-60 p-4 rounded-xl">
          <AnimatedSlider
            label="🧘 Mindful Eating Score"
            value={mindfulScore}
            onChange={setMindfulScore}
            color="purple"
          />
        </div>

        <div className="bg-white bg-opacity-60 p-4 rounded-xl">
          <label className="block text-sm font-semibold text-gray-700 mb-3">📝 Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-purple-200 transition-all placeholder-gray-400"
            rows={3}
            placeholder="How did this meal make you feel?"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Saving...</span>
            </div>
          ) : (
            '🍽️ Log This Meal'
          )}
        </button>
      </form>
    </div>
  );
};

export default FoodLogForm;