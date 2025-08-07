import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, BookOpen, BarChart3, Settings, Plus, Moon, Sun, Sparkles, Brain, Zap, Star } from 'lucide-react';

// Utility function to safely parse dates
const safeParseDate = (dateString) => {
  if (!dateString) return new Date();
  
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

// API service - Fixed version
const API_BASE = 'http://localhost:8000/api';

const api = {
  async request(endpoint, options = {}) {
    try {
      console.log(`Making API request to ${API_BASE}${endpoint}`, options);
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      console.log(`API response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}: ${errorText}`);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  // User APIs
  createUser: (userData) => api.request('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Check-in APIs
  createCheckin: (checkinData) => api.request('/checkins', {
    method: 'POST',
    body: JSON.stringify(checkinData),
  }),
  getTodayCheckin: (type) => api.request(`/checkins/today?checkin_type=${type}`),
  
  // Food log APIs
  createFoodLog: (foodData) => api.request('/food-logs', {
    method: 'POST',
    body: JSON.stringify(foodData),
  }),
  getFoodLogs: () => api.request('/food-logs'),
  
  // Chat APIs - Fixed to match your backend response format
  sendMessage: async (message) => {
    const response = await api.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    
    // Your backend returns { message: "...", timestamp: "..." }
    return {
      message: response.message,
      timestamp: response.timestamp || new Date().toISOString()
    };
  },
  
  getChatHistory: async () => {
    try {
      const response = await api.request('/chat/history');
      console.log('Raw chat history response:', response);
      
      // Your backend might return different format, let's handle both
      if (Array.isArray(response)) {
        return response;
      } else if (response && Array.isArray(response.history)) {
        return response.history;
      } else if (response && Array.isArray(response.messages)) {
        return response.messages;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get chat history:', error);
      return [];
    }
  },
  
  // Journal APIs
  createJournalEntry: (entryData) => api.request('/journal', {
    method: 'POST',
    body: JSON.stringify(entryData),
  }),
  getJournalEntries: () => api.request('/journal'),
  
  // Insights APIs
  getMoodTrends: () => api.request('/insights/mood-trends'),
  getWeeklySummary: () => api.request('/insights/weekly-summary'),
  
  // Suggestions APIs
  getMealSuggestions: (mood, energyLevel) => {
    const params = new URLSearchParams();
    if (mood) params.append('mood', mood);
    if (energyLevel) params.append('energy_level', energyLevel);
    return api.request(`/suggestions/meals?${params.toString()}`);
  },
  getMindfulPractices: (mood) => {
    const params = new URLSearchParams();
    if (mood) params.append('current_mood', mood);
    return api.request(`/suggestions/mindful-practices?${params.toString()}`);
  },
};
// Enhanced Components
const MoodSelector = ({ selectedMood, onMoodChange }) => {
  const moods = [
    { value: 'very_low', label: '😞', title: 'Very Low', color: 'from-red-400 to-red-600', textColor: 'text-red-100' },
    { value: 'low', label: '😔', title: 'Low', color: 'from-orange-400 to-orange-600', textColor: 'text-orange-100' },
    { value: 'neutral', label: '😐', title: 'Neutral', color: 'from-gray-400 to-gray-600', textColor: 'text-gray-100' },
    { value: 'good', label: '😊', title: 'Good', color: 'from-green-400 to-green-600', textColor: 'text-green-100' },
    { value: 'excellent', label: '😄', title: 'Excellent', color: 'from-blue-400 to-blue-600', textColor: 'text-blue-100' },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {moods.map((mood) => (
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

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await api.getChatHistory();
        console.log('Chat history loaded:', history);
        
        if (history && Array.isArray(history) && history.length > 0) {
          const formattedMessages = history.map(msg => {
            // Handle different timestamp formats
            let timestamp = new Date();
            if (msg.timestamp) {
              const parsedDate = new Date(msg.timestamp);
              if (!isNaN(parsedDate.getTime())) {
                timestamp = parsedDate;
              }
            }
            
            return {
              type: msg.role === 'user' ? 'user' : 'ai',
              content: msg.message || msg.content,
              timestamp: timestamp,
            };
          });
          
          // Only add to existing welcome message if we have history
          setMessages(prev => [...prev, ...formattedMessages]);
        }
      } catch (error) {
        console.warn('Could not load chat history:', error);
      }
    };

    loadChatHistory();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = input;
    setInput('');
    setLoading(true);
    setConnectionError(false);

    try {
      console.log('Sending message:', messageToSend);
      const response = await api.sendMessage(messageToSend);
      console.log('AI response received:', response);
      
      // Handle timestamp safely
      let responseTimestamp = new Date();
      if (response.timestamp) {
        const parsedDate = new Date(response.timestamp);
        if (!isNaN(parsedDate.getTime())) {
          responseTimestamp = parsedDate;
        }
      }
      
      const aiMessage = {
        type: 'ai',
        content: response.message,
        timestamp: responseTimestamp,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setLoading(false);
      setConnectionError(true);
      
      // Show error message
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

  const mealEmojis = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎'
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 rounded-2xl">
      <div className="text-center">
        <div className="text-4xl mb-2">{mealEmojis[mealType]}</div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Food & Mood Tracker
        </h3>
        <p className="text-gray-600 mt-2">Track how food affects your wellbeing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white bg-opacity-60 p-4 rounded-xl">
          <label className="block text-sm font-semibold text-gray-700 mb-3">🍽️ Meal Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(mealEmojis).map(([type, emoji]) => (
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

const JournalForm = ({ onComplete }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      await api.createJournalEntry({
        title: title || null,
        content,
        mood: mood || null,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        is_private: true,
      });
      setSuccess(true);
      setTimeout(() => onComplete(), 2000);
    } catch (error) {
      console.error('Failed to create journal entry:', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="animate-bounce text-6xl mb-4">📖</div>
        <h3 className="text-2xl font-bold text-purple-600 mb-2">Journal Entry Saved!</h3>
        <p className="text-gray-600">Your thoughts are safely stored. Keep reflecting!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6 rounded-2xl">
      <div className="text-center">
        <div className="text-4xl mb-2">📖</div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Digital Journal
        </h3>
        <p className="text-gray-600 mt-2">Express your thoughts and feelings freely</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white bg-opacity-60 p-4 rounded-xl">
          <label className="block text-sm font-semibold text-gray-700 mb-3">✨ Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-purple-200 transition-all placeholder-gray-400"
            placeholder="Give your entry a meaningful title..."
          />
        </div>

        <div className="bg-white bg-opacity-60 p-4 rounded-xl">
          <label className="block text-sm font-semibold text-gray-700 mb-3">💭 Your thoughts</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-purple-200 transition-all placeholder-gray-400"
            rows={8}
            placeholder="What's on your mind? There's no right or wrong way to journal..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-60 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-3">😊 Current mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full p-3 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-purple-200 transition-all"
            >
              <option value="">How are you feeling?</option>
              <option value="very_low">😞 Very Low</option>
              <option value="low">😔 Low</option>
              <option value="neutral">😐 Neutral</option>
              <option value="good">😊 Good</option>
              <option value="excellent">😄 Excellent</option>
            </select>
          </div>
          <div className="bg-white bg-opacity-60 p-4 rounded-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-3">🏷️ Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 border-0 rounded-xl bg-white bg-opacity-80 focus:bg-opacity-100 focus:ring-4 focus:ring-purple-200 transition-all placeholder-gray-400"
              placeholder="gratitude, work, family, dreams"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Saving...</span>
            </div>
          ) : (
            '📖 Save Entry'
          )}
        </button>
      </form>
    </div>
  );
};

// Main App
const MindMateApp = () => {
  const [activeTab, setActiveTab] = useState('checkin');
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalType, setModalType] = useState('');

  const openModal = (content, type = '') => {
    setModalContent(content);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
    setModalType('');
  };

  const tabs = [
    { id: 'checkin', label: 'Check-in', icon: Heart, gradient: 'from-pink-500 to-rose-500' },
    { id: 'chat', label: 'Chat', icon: MessageCircle, gradient: 'from-blue-500 to-purple-500' },
    { id: 'journal', label: 'Journal', icon: BookOpen, gradient: 'from-purple-500 to-indigo-500' },
    { id: 'insights', label: 'Insights', icon: BarChart3, gradient: 'from-green-500 to-blue-500' },
  ];

  const getModalTitle = () => {
    switch (modalType) {
      case 'morning-checkin':
        return '🌅 Morning Check-in';
      case 'evening-checkin':
        return '🌙 Evening Check-in';
      case 'food-log':
        return '🍽️ Food Logger';
      case 'journal':
        return '📖 Journal Entry';
      case 'emergency':
        return '🆘 Emergency Resources';
      default:
        return 'MindMate';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'checkin':
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

      case 'chat':
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

      case 'journal':
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

      case 'insights':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">📊</div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Your Wellness Insights
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Understand your patterns, celebrate progress, and discover what works best for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Mood Patterns</h3>
                  <div className="text-3xl">📈</div>
                </div>
                <div className="bg-white rounded-2xl p-6 mb-4">
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">7.2</div>
                      <div className="text-sm text-gray-500">Average mood this week</div>
                      <div className="text-xs text-green-600 mt-1">↗️ +0.8 from last week</div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Your mood has been trending upward. Keep up the great work!</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Mindful Eating</h3>
                  <div className="text-3xl">🧘</div>
                </div>
                <div className="bg-white rounded-2xl p-6 mb-4">
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">8.4</div>
                      <div className="text-sm text-gray-500">Mindfulness score</div>
                      <div className="text-xs text-green-600 mt-1">🎯 Excellent progress</div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">You're becoming more mindful with your eating habits!</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Check-in Streak</h3>
                  <div className="text-3xl">🔥</div>
                </div>
                <div className="bg-white rounded-2xl p-6 mb-4">
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">12</div>
                      <div className="text-sm text-gray-500">Days in a row</div>
                      <div className="text-xs text-purple-600 mt-1">🌟 Amazing consistency!</div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Consistency is key to mental wellness. You're doing great!</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Stress Levels</h3>
                  <div className="text-3xl">😌</div>
                </div>
                <div className="bg-white rounded-2xl p-6 mb-4">
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600 mb-2">4.1</div>
                      <div className="text-sm text-gray-500">Average stress level</div>
                      <div className="text-xs text-green-600 mt-1">↘️ -1.3 from last week</div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">Your stress levels are decreasing. Great job managing stress!</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Zap className="h-8 w-8 mr-3 text-indigo-600" />
                Personalized Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">🥗</div>
                    <h4 className="text-lg font-bold text-gray-800">Mood-Boosting Foods</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Based on your patterns, these foods help improve your mood and energy.
                  </p>
                  <div className="space-y-2">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs inline-block mr-2">Avocados</div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs inline-block mr-2">Blueberries</div>
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs inline-block">Dark Chocolate</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">🧘</div>
                    <h4 className="text-lg font-bold text-gray-800">Mindfulness Practices</h4>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Personalized practices to help you feel more centered and calm.
                  </p>
                  <div className="space-y-2">
                    <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs inline-block mr-2">5-min Meditation</div>
                    <div className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs inline-block mr-2">Gratitude Practice</div>
                    <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs inline-block">Breathing Exercise</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl border-b border-white border-opacity-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    MindMate
                  </h1>
                  <p className="text-sm text-gray-500">Your wellness companion</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-3 text-gray-500 hover:text-gray-700 bg-white bg-opacity-60 rounded-xl hover:bg-opacity-80 transition-all"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button className="p-3 text-gray-500 hover:text-gray-700 bg-white bg-opacity-60 rounded-xl hover:bg-opacity-80 transition-all">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white bg-opacity-60 backdrop-blur-md border-b border-white border-opacity-20">
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
                        : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-60'
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            {renderTabContent()}
          </div>
        </main>

        {/* Emergency Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => openModal(
              <div className="space-y-6 p-2">
                <div className="text-center">
                  <div className="text-5xl mb-4">🆘</div>
                  <h3 className="text-2xl font-bold text-red-600 mb-4">Emergency Support</h3>
                  <p className="text-gray-600 mb-6">
                    If you're in crisis or need immediate support, these resources are here for you.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-red-50 border-2 border-red-200 p-6 rounded-2xl">
                    <h4 className="font-bold text-red-800 text-lg mb-3 flex items-center">
                      <span className="mr-2">📞</span>
                      Crisis Helplines
                    </h4>
                    <div className="space-y-2 text-red-700">
                      <p><strong>National Suicide Prevention Lifeline:</strong> 988</p>
                      <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                      <p><strong>NAMI Helpline:</strong> 1-800-950-NAMI</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-2xl">
                    <h4 className="font-bold text-blue-800 text-lg mb-3 flex items-center">
                      <span className="mr-2">🧘</span>
                      5-4-3-2-1 Grounding
                    </h4>
                    <p className="text-blue-700 leading-relaxed">
                      Name 5 things you can see, 4 things you can touch, 3 things you can hear, 
                      2 things you can smell, and 1 thing you can taste.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl">
                    <h4 className="font-bold text-green-800 text-lg mb-3 flex items-center">
                      <span className="mr-2">🫁</span>
                      Box Breathing
                    </h4>
                    <p className="text-green-700 leading-relaxed">
                      Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. 
                      Repeat this cycle 4-6 times to calm your nervous system.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={closeModal}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 px-6 rounded-2xl font-bold hover:shadow-xl transition-all"
                >
                  Close
                </button>
              </div>,
              'emergency'
            )}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-pulse"
            title="Emergency Resources - You're not alone"
          >
            <span className="text-2xl">🆘</span>
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-3xl border border-white border-opacity-20">
              <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 px-8 py-6 flex justify-between items-center rounded-t-3xl">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {getModalTitle()}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 bg-white bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 transition-all"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-8 py-6">
                {modalContent}
              </div>
            </div>
          </div>
        )}

        {/* Floating Motivational Messages */}
        <div className="fixed bottom-8 left-8 max-w-xs">
          <div className="bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white border-opacity-20">
            <div className="flex items-start space-x-3">
              <div className="text-2xl animate-pulse">💫</div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Daily Reminder</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your mental health matters. Every small step you take towards wellness is meaningful and brave.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        /* Custom scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }

        /* Enhanced slider styling */
        input[type="range"] {
          background: transparent;
          -webkit-appearance: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          transition: all 0.3s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.6);
        }

        input[type="range"]::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
          transition: all 0.3s ease;
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.6);
        }

        /* Gradient text animation */
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }

        /* Glass morphism effect */
        .glass {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        /* Hover animations */
        .hover-lift:hover {
          transform: translateY(-4px);
        }

        .hover-glow:hover {
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
        }

        /* Success animations */
        @keyframes successBounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -30px, 0);
          }
          70% {
            transform: translate3d(0, -15px, 0);
          }
          90% {
            transform: translate3d(0, -4px, 0);
          }
        }

        .animate-success {
          animation: successBounce 1s ease-in-out;
        }

        /* Floating animation */
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Pulse with color change */
        @keyframes colorPulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-color-pulse {
          animation: colorPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MindMateApp;