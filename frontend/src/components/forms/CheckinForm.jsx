import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import MoodSelector from '../ui/MoodSelector';
import AnimatedSlider from '../ui/AnimatedSlider';
import { api } from '../../services/api';

const CheckinForm = ({ type, onComplete }) => {

  const [mood, setMood] = useState('neutral');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [hungerLevel, setHungerLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [notes, setNotes] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createCheckin({
        checkin_type: type,
        mood,
        energy_level: energyLevel,
        stress_level: stressLevel,
        hunger_level: hungerLevel,
        sleep_quality: sleepQuality,
        notes: notes || null,
        gratitude: gratitude || null,
      });
      setSuccess(true);
      setTimeout(() => onComplete(), 2000);
    } catch (error) {
      console.error('Failed to submit check-in:', error);
      alert('Failed to submit check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="animate-bounce text-6xl mb-4">✨</div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">Check-in Complete!</h3>
        <p className="text-gray-600">Thank you for taking time to reflect on your wellbeing.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6 rounded-2xl">
      <div className="text-center">
        <div className="text-4xl mb-2">
          {type === 'morning' ? '🌅' : '🌙'}
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {type === 'morning' ? 'Morning Reflection' : 'Evening Reflection'}
        </h3>
        <p className="text-gray-600 mt-2">
          {type === 'morning' ? 'Start your day with intention' : 'Reflect on your day with gratitude'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white bg-opacity-60 p-4 rounded-xl">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            How are you feeling right now?
          </label>
          <MoodSelector selectedMood={mood} onMoodChange={setMood} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-60 p-4 rounded-xl">
            <AnimatedSlider
              label="⚡ Energy Level"
              value={energyLevel}
              onChange={setEnergyLevel}
              min={1}
              max={5}
              color="yellow"
            />
          </div>
          
          <div className="bg-white bg-opacity-60 p-4 rounded-xl">
            <AnimatedSlider
              label="😰 Stress Level"
              value={stressLevel}
              onChange={setStressLevel}
              color="red"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-60 p-4 rounded-xl">
            <AnimatedSlider
              label="🍽️ Hunger Level"
              value={hungerLevel}
              onChange={setHungerLevel}
              color="green"
            />
          </div>
          
          {type === 'morning' && (
            <div className="bg-white bg-opacity-60 p-4 rounded-xl">
              <AnimatedSlider
                label="😴 Sleep Quality"
                value={sleepQuality}
                onChange={setSleepQuality}
                color="indigo"
              />
            </div>
          )}
        </div>

        <div className="bg-white bg-opacity-60 p-4 rounded-xl">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            💭 What's on your mind?
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-purple-200 transition-all placeholder-gray-400"
            rows={3}
            placeholder="Share your thoughts..."
          />
        </div>

        {type === 'evening' && (
          <div className="bg-white bg-opacity-60 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🙏 What are you grateful for today?
            </label>
            <textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              className="w-full p-4 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-purple-200 transition-all placeholder-gray-400"
              rows={2}
              placeholder="Even small moments of joy count..."
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Saving...</span>
            </div>
          ) : (
            `Complete ${type === 'morning' ? '🌅' : '🌙'} Check-in`
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckinForm;
