
// components/tabs/ChatTab.jsx
import React from 'react';
import ChatInterface from '../chat/ChatInterface';

const ChatTab = () => {
  return (
    <div className="h-full space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-pulse">🤖</div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          AI Wellness Companion
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          I'm here to listen, support, and help you navigate your emotions with empathy and understanding.
        </p>
      </div>
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 h-[500px] overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatTab;