import React from 'react';

const AnimatedSlider = ({ label, value, onChange, min = 1, max = 10, color = "blue" }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className={`px-3 py-1 rounded-full bg-${color}-100 text-${color}-800 text-sm font-bold`}>
          {value}/{max}
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-${color}-200 transition-all`}
          style={{
            background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${percentage}%, rgb(229 231 235) ${percentage}%, rgb(229 231 235) 100%)`
          }}
        />
        <div 
          className={`absolute top-0 h-3 bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-full pointer-events-none transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default AnimatedSlider;
