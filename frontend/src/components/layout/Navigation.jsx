import React from 'react';
import { Heart, MessageCircle, BookOpen, User, Wind, BarChart3 } from 'lucide-react';
import { TABS_CONFIG } from '../../utils/constants';
// Replace the existing Navigation component:

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'checkin', label: 'Check-in', icon: Heart, gradient: 'from-pink-500 to-red-500' },
    { id: 'breathing', label: 'Breathing', icon: Wind, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'chat', label: 'Chat', icon: MessageCircle, gradient: 'from-blue-500 to-purple-500' },
    { id: 'journal', label: 'Journal', icon: BookOpen, gradient: 'from-green-500 to-teal-500' },
    { id: 'profile', label: 'Profile', icon: User, gradient: 'from-purple-500 to-pink-500' }
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 bg-opacity-60 backdrop-blur-md border-b border-white dark:border-gray-700 border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-2 overflow-x-auto py-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg scale-105`
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700 hover:bg-opacity-60'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;