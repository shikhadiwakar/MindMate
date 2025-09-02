// components/tabs/JournalTab.jsx
import React from 'react';
import { BookOpen, Brain } from 'lucide-react';
import JournalForm from '../forms/JournalForm';

const JournalTab = ({ openModal, closeModal }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">📖</div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Digital Journal
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Express your thoughts, feelings, and experiences in a safe, private space.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-200 rounded-3xl p-8 shadow-xl">
              <div className="flex items-start space-x-6">
                <div className="text-5xl animate-pulse">✍️</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Create New Entry</h3>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    Journaling helps you process emotions, gain insights, and track your mental health journey. Write freely and authentically.
                  </p>
                  <button
                    onClick={() => openModal(
                      <JournalForm onComplete={closeModal} />,
                      'journal'
                    )}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <BookOpen className="h-6 w-6 inline mr-2" />
                    Start Writing
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Brain className="h-8 w-8 mr-3 text-purple-600" />
                Journaling Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🧠</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Mental Clarity</h4>
                      <p className="text-gray-600 text-sm">Organize your thoughts and gain new perspectives</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">💝</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Emotional Processing</h4>
                      <p className="text-gray-600 text-sm">Work through feelings in a healthy way</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">📈</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Track Progress</h4>
                      <p className="text-gray-600 text-sm">See your growth and healing journey</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Self-Awareness</h4>
                      <p className="text-gray-600 text-sm">Understand your patterns and triggers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
};

export default JournalTab;