// components/ui/MoodSelector.jsx
import React from 'react';
import { Sparkles } from 'lucide-react';
import { MOOD_OPTIONS } from '../../utils/constants';

const MoodSelector = ({ selectedMood, onMoodChange }) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {MOOD_OPTIONS.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onMoodChange(mood.value)}
          className={`relative p-4 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 ${
            selectedMood === mood.value
              ? `bg-gradient-to-br ${mood.color} ${mood.textColor} scale-110 shadow-xl ring-4 ring-white ring-opacity-60`
              : 'bg-white bg-opacity-70 hover:bg-opacity-90 text-gray-700 shadow-lg'
          }`}
        >
          <div className="text-2xl mb-1">{mood.label}</div>
          <div className="text-xs font-medium">{mood.title}</div>
          {selectedMood === mood.value && (
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;