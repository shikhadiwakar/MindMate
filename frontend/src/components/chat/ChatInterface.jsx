import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { api } from '../../services/api'; // Using the api object

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: "Hi there! ✨ I'm your personal wellness companion. I'm here to listen, support, and help you navigate your feelings. How are you doing today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);


  // Replace the useEffect for loading chat history:
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        console.log('🔍 Starting to load chat history...');
        const history = await api.getChatHistory();
        console.log('🔍 Chat history loaded:', history);
        
        if (history && Array.isArray(history) && history.length > 0) {
          const formattedMessages = history
            .filter(conversation => {
              // More thorough filtering
              const hasUserMessage = conversation.user_message && 
                                    typeof conversation.user_message === 'string' && 
                                    conversation.user_message.trim() !== '';
              const hasAiResponse = conversation.ai_response && 
                                  typeof conversation.ai_response === 'string' && 
                                  conversation.ai_response.trim() !== '';
              
              console.log('🔍 Filtering conversation:', {
                hasUserMessage,
                hasAiResponse,
                userMessage: conversation.user_message,
                aiResponse: conversation.ai_response
              });
              
              return hasUserMessage || hasAiResponse;
            })
            .flatMap(conversation => {
              const messages = [];
              
              // Add user message
              if (conversation.user_message && conversation.user_message.trim()) {
                messages.push({
                  type: 'user',
                  content: conversation.user_message.trim(),
                  timestamp: new Date(conversation.created_at || Date.now())
                });
              }
              
              // Add AI response
              if (conversation.ai_response && conversation.ai_response.trim()) {
                messages.push({
                  type: 'ai',
                  content: conversation.ai_response.trim(),
                  timestamp: new Date(conversation.created_at || Date.now())
                });
              }
              
              return messages;
            })
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) // Sort by timestamp
            .slice(-20); // Keep only last 20 messages
          
          console.log('🔍 Formatted messages:', formattedMessages);
          
          // Replace welcome message with history if we have any
          if (formattedMessages.length > 0) {
            setMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.warn('❌ Could not load chat history:', error);
      }
    };

    loadChatHistory();
  }, []);

  // Replace the sendMessage function:
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const messageText = input.trim();
    const userMessage = {
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setConnectionError(false);

    try {
      console.log('📤 Sending message:', messageText);
      const response = await api.sendMessage(messageText);
      console.log('📨 AI response received:', response);
      
      // Validate response more thoroughly
      if (!response) {
        throw new Error('No response from server');
      }
      
      if (!response.message || typeof response.message !== 'string' || response.message.trim() === '') {
        console.error('Invalid response format:', response);
        throw new Error('Empty or invalid response from AI');
      }
      
      let responseTimestamp = new Date();
      if (response.timestamp) {
        const parsedDate = new Date(response.timestamp);
        if (!isNaN(parsedDate.getTime())) {
          responseTimestamp = parsedDate;
        }
      }
      
      const aiMessage = {
        type: 'ai',
        content: response.message.trim(),
        timestamp: responseTimestamp,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
      
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      setLoading(false);
      setConnectionError(true);
      
      const errorMessage = {
        type: 'ai',
        content: "I'm experiencing some technical difficulties right now. Please check your internet connection and try again later. I'm still here with you though. 💙",
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleRetry = () => {
    setConnectionError(false);
    // Retry the last user message
    const lastUserMessage = [...messages].reverse().find(msg => msg.type === 'user');
    if (lastUserMessage) {
      setInput(lastUserMessage.content);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl overflow-hidden">
      {/* Connection Status Banner */}
      {connectionError && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-800">Connection issues detected</span>
            </div>
            <button 
              onClick={handleRetry}
              className="text-yellow-800 hover:text-yellow-900 font-medium underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-6 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                message.type === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  : message.error
                  ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-800 border border-red-300'
                  : 'bg-white bg-opacity-90 text-gray-800 border border-white border-opacity-60'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs opacity-70">
                  {message.timestamp && !isNaN(message.timestamp.getTime()) 
                    ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Now'
                  }
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white bg-opacity-90 text-gray-800 px-6 py-3 rounded-2xl shadow-lg">
              <div className="flex space-x-2 items-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-white border-opacity-20 bg-white bg-opacity-60 p-4">
        <div className="flex space-x-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={connectionError ? "Connection issue - please try again..." : "Share what's on your heart..."}
            className={`flex-1 p-4 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-purple-200 transition-all resize-none placeholder-gray-400 ${
              connectionError ? 'bg-red-50 border border-red-200' : ''
            }`}
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className={`px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none ${
              connectionError 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            }`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              </div>
            ) : (
              <MessageCircle className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;