// API service - Fixed version with auth utilities
// NO IMPORTS NEEDED - Pure JavaScript
export const API_BASE = 'http://localhost:8000/api';

// Authentication utility functions
// Add these functions after the API_BASE declaration
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const checkTokenValidity = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};


export const api = { 
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
// Food log APIs
  createFoodLog: (foodData) => api.request('/food-logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      food_name: foodData.food_name,
      meal_type: foodData.meal_type,
      portion_size: foodData.portion_size,
      calories: foodData.calories,
      mood_before: foodData.mood_before,
      mood_after: foodData.mood_after,
      notes: foodData.notes,
    }),
  }),

  getFoodLogs: () => api.request('/food-logs'),

  sendMessage: async (message) => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/chat`, {
        method: 'POST',
        body: JSON.stringify({ message })
      });
      
      // Your backend returns { message: "...", timestamp: "..." }
      return {
        message: response.message,
        timestamp: response.timestamp || new Date().toISOString()
      };
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  },
  
  getChatHistory: async () => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/chat/history`);
      console.log('Raw chat history response:', response);
      
      // Handle different response formats
      let history = [];
      if (Array.isArray(response)) {
        history = response;
      } else if (response && Array.isArray(response.data)) {
        history = response.data;
      }
      
      // Filter out conversations with empty messages
      const validHistory = history.filter(conversation => {
        return conversation && (
          (conversation.user_message && conversation.user_message.trim()) ||
          (conversation.ai_response && conversation.ai_response.trim())
        );
      });
      
      console.log('Processed chat history:', validHistory);
      return validHistory;
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

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  if (!checkTokenValidity()) {
    clearAuthData();
    throw new Error('Session expired. Please login again.');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    clearAuthData();
    throw new Error('Session expired. Please login again.');
  }

  return handleResponse(response);
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,     // 👈 matches backend model UserLogin
      password
    })
  });

  return handleResponse(response);
};



export const signup = async (userData) => {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  return handleResponse(response);
};

export const getCurrentUser = async () => {
  return makeAuthenticatedRequest(`${API_BASE}/auth/me`);
};

// Check-in APIs
export const saveCheckin = async (checkinData) => {
  return makeAuthenticatedRequest(`${API_BASE}/checkins/`, {
    method: 'POST',
    body: JSON.stringify(checkinData)
  });
};

export const getCheckins = async (limit = 30) => {
  return makeAuthenticatedRequest(`${API_BASE}/checkins/?limit=${limit}`);
};

export const getCheckinById = async (checkinId) => {
  return makeAuthenticatedRequest(`${API_BASE}/checkins/${checkinId}`);
};

// Food Log APIs
export const saveFoodLog = async (foodData) => {
  return makeAuthenticatedRequest(`${API_BASE}/food-logs/`, {
    method: 'POST',
    body: JSON.stringify(foodData)
  });
};

export const getFoodLogs = async (limit = 30) => {
  return makeAuthenticatedRequest(`${API_BASE}/food-logs/?limit=${limit}`);
};

// Journal APIs
export const saveJournalEntry = async (journalData) => {
  return makeAuthenticatedRequest(`${API_BASE}/journal-entries/`, {
    method: 'POST',
    body: JSON.stringify(journalData)
  });
};

export const getJournalEntries = async (limit = 30) => {
  return makeAuthenticatedRequest(`${API_BASE}/journal-entries/?limit=${limit}`);
};

export const getJournalEntryById = async (entryId) => {
  return makeAuthenticatedRequest(`${API_BASE}/journal-entries/${entryId}`);
};


export const sendChatMessage = async (message, context = null) => {
  return makeAuthenticatedRequest(`${API_BASE}/chat`, {
    method: 'POST',
    body: JSON.stringify({
      message: message.trim(),
      context
    })
  });
};

export const getChatHistory = async (limit = 50) => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/chat/history?limit=${limit}`);
    
    // Handle the response format
    let history = [];
    if (Array.isArray(response)) {
      history = response;
    } else if (response && Array.isArray(response.data)) {
      history = response.data;
    }
    
    // Filter out invalid conversations
    const validHistory = history.filter(conversation => {
      return conversation && (
        (conversation.user_message && conversation.user_message.trim()) ||
        (conversation.ai_response && conversation.ai_response.trim())
      );
    });
    
    return validHistory;
  } catch (error) {
    console.error('Failed to get chat history:', error);
    return [];
  }
};



// Insights APIs
export const getUserInsights = async (days = 30) => {
  return makeAuthenticatedRequest(`${API_BASE}/insights/?days=${days}`);
};

export const getMoodTrends = async (days = 30) => {
  return makeAuthenticatedRequest(`${API_BASE}/insights/mood-trends?days=${days}`);
};

export const getPersonalizedRecommendations = async () => {
  return makeAuthenticatedRequest(`${API_BASE}/insights/recommendations`);
};

// User Profile APIs
export const updateUserProfile = async (profileData) => {
  return makeAuthenticatedRequest(`${API_BASE}/users/profile`, {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
};

export const updateUserPreferences = async (preferences) => {
  return makeAuthenticatedRequest(`${API_BASE}/users/preferences`, {
    method: 'PUT',
    body: JSON.stringify({ preferences })
  });
};

// Dashboard/Summary APIs
export const getDashboardData = async () => {
  return makeAuthenticatedRequest(`${API_BASE}/dashboard/`);
};

export const getUserStats = async (period = '7d') => {
  return makeAuthenticatedRequest(`${API_BASE}/users/stats?period=${period}`);
};

// Emergency and Crisis APIs
export const reportCrisisSignal = async (signalData) => {
  return makeAuthenticatedRequest(`${API_BASE}/crisis/signal`, {
    method: 'POST',
    body: JSON.stringify(signalData)
  });
};

export const getEmergencyResources = async (location = null) => {
  const url = location 
    ? `${API_BASE}/emergency/resources?location=${encodeURIComponent(location)}`
    : `${API_BASE}/emergency/resources`;
    
  return makeAuthenticatedRequest(url);
};

// Breathing Session APIs
export const saveBreathingSession = async (sessionData) => {
  return makeAuthenticatedRequest(`${API_BASE}/breathing-sessions/`, {
    method: 'POST',
    body: JSON.stringify({
      technique: sessionData.technique,
      duration_seconds: sessionData.duration,
      completed: sessionData.completed,
      session_date: new Date().toISOString()
    })
  });
};

export const getBreathingSessions = async (limit = 30) => {
  return makeAuthenticatedRequest(`${API_BASE}/breathing-sessions/?limit=${limit}`);
};

// User Streak and Stats APIs
export const getUserStreakData = async () => {
  return makeAuthenticatedRequest(`${API_BASE}/users/streak-data`);
};

export const updateStreakData = async (streakData) => {
  return makeAuthenticatedRequest(`${API_BASE}/users/streak-data`, {
    method: 'PUT',
    body: JSON.stringify(streakData)
  });
};

export const getUserDashboardStats = async (days = 30) => {
  return makeAuthenticatedRequest(`${API_BASE}/users/dashboard-stats?days=${days}`);
};

// Update the existing getUserStats to include more comprehensive data
export const getDetailedUserStats = async (period = '30d') => {
  return makeAuthenticatedRequest(`${API_BASE}/users/detailed-stats?period=${period}`);
};