// components/layout/EmergencyButton.jsx
import React from 'react';
import { EMERGENCY_RESOURCES } from '../../utils/constants';

const EmergencyModal = ({ onClose }) => {
  return (
    <div className="space-y-6 p-2">
      <div className="text-center">
        <div className="text-5xl mb-4">🆘</div>
        <h3 className="text-2xl font-bold text-red-600 mb-4">{EMERGENCY_RESOURCES.title}</h3>
        <p className="text-gray-600 mb-6">
          {EMERGENCY_RESOURCES.description}
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl">
          <h4 className="font-bold text-red-800 text-lg mb-3 flex items-center">
            <span className="mr-2">📞</span>
            Crisis Helplines
          </h4>
          <div className="space-y-2 text-red-700">
            {EMERGENCY_RESOURCES.helplines.map((helpline, index) => (
              <p key={index}>
                <strong>{helpline.name}:</strong> {helpline.number}
              </p>
            ))}
          </div>
        </div>
        
        {EMERGENCY_RESOURCES.techniques.map((technique, index) => (
          <div key={index} className={`border-2 p-6 rounded-2xl ${
            index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
          }`}>
            <h4 className={`font-bold text-lg mb-3 flex items-center ${
              index === 0 ? 'text-blue-800' : 'text-green-800'
            }`}>
              {technique.title}
            </h4>
            <p className={`leading-relaxed ${
              index === 0 ? 'text-blue-700' : 'text-green-700'
            }`}>
              {technique.description}
            </p>
          </div>
        ))}
      </div>
      
      <button
        onClick={onClose}
        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-xl transition-all"
      >
        Close
      </button>
    </div>
  );
};

const EmergencyButton = ({ openModal }) => {
  const handleEmergencyClick = () => {
    openModal(
      <EmergencyModal onClose={() => openModal(null)} />,
      'emergency'
    );
  };

  return (
    <div className="fixed bottom-8 right-8">
      <button
        onClick={handleEmergencyClick}
        className="bg-gradient-to-r from-red-500 to-red-600 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-pulse"
        title="Emergency Resources - You're not alone"
      >
        <span className="text-2xl">🆘</span>
      </button>
    </div>
  );
};

export default EmergencyButton;