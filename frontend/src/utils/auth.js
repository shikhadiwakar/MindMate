// utils/auth.js - Authentication utilities for frontend

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Get user data from localStorage
export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user && !isTokenExpired(token));
};

// Clear all auth data and reload
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Optionally reload the page or redirect
  window.location.reload();
};

// Set authentication data
export const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if JWT token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // JWT tokens have 3 parts separated by dots
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Add 5 minute buffer to account for clock skew
    return payload.exp < (currentTime + 300);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Check token validity and auto-logout if expired
export const checkTokenValidity = () => {
  const token = getToken();
  
  if (token && isTokenExpired(token)) {
    console.log('Token expired, logging out...');
    logout();
    return false;
  }
  
  return !!token;
};

// Get authorization headers for API calls
export const getAuthHeaders = () => {
  const token = getToken();
  
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};

// Initialize auth check on app load
export const initAuth = () => {
  return checkTokenValidity();
};

// Get user ID from token (without server call)
export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    return null;
  }
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub; // 'sub' is the standard JWT claim for user ID
  } catch (error) {
    console.error('Error extracting user ID from token:', error);
    return null;
  }
};

// Refresh token if needed (implement based on your backend)
export const refreshTokenIfNeeded = async () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpire = payload.exp - currentTime;
    
    // If token expires in less than 1 hour, refresh it
    if (timeToExpire < 3600) {
      // Implement token refresh logic here
      // This would depend on your backend implementation
      console.log('Token needs refresh...');
      return false; // For now, just return false
    }
    
    return true;
  } catch (error) {
    console.error('Error checking token refresh:', error);
    return false;
  }
};

// Handle authentication errors
export const handleAuthError = (error) => {
  if (error.status === 401 || error.message?.includes('401')) {
    console.log('Authentication error, clearing auth data...');
    clearAuthData();
    window.location.reload();
    return true;
  }
  return false;
};

// Auto-retry API calls with token refresh
export const makeAuthenticatedRequest = async (url, options = {}) => {
  // Check token validity first
  if (!checkTokenValidity()) {
    throw new Error('No valid authentication token');
  }
  
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (response.status === 401) {
      // Token might be expired, clear auth data
      clearAuthData();
      throw new Error('Authentication expired');
    }
    
    return response;
  } catch (error) {
    if (error.message?.includes('Authentication expired')) {
      // Redirect to login or reload app
      window.location.reload();
    }
    throw error;
  }
};

// Validate user data structure
export const isValidUser = (user) => {
  return user && 
         typeof user === 'object' && 
         user.id && 
         user.name && 
         user.email;
};

// Get display name for user
export const getUserDisplayName = (user) => {
  if (!user) return 'User';
  return user.name ? user.name.split(' ')[0] : 'User';
};

// Check if user has specific preferences
export const userHasPreference = (user, preference) => {
  if (!user || !user.preferences) return false;
  return user.preferences.includes(preference);
};

// Update user data in localStorage
export const updateUserData = (updatedUser) => {
  if (!isValidUser(updatedUser)) {
    console.error('Invalid user data provided to updateUserData');
    return false;
  }
  
  try {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
};