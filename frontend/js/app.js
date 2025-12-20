// ============================================
// API CONFIGURATION
// ============================================
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Helper function to decode JWT token
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

// Helper function to get current user info (from localStorage or JWT)
function getCurrentUser() {
  // First try localStorage
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      // If parse fails, try JWT
    }
  }
  
  // Fallback to JWT token
  const token = getAuthToken();
  if (token) {
    const decoded = decodeJWT(token);
    if (decoded) {
      return {
        id: decoded.userId || decoded.id,
        role: decoded.role
      };
    }
  }
  
  return null;
}

// Helper function to get user role (from JWT token - most secure)
function getUserRole() {
  const token = getAuthToken();
  if (token) {
    const decoded = decodeJWT(token);
    if (decoded && decoded.role) {
      return decoded.role;
    }
  }
  
  // Fallback to localStorage
  const user = getCurrentUser();
  return user ? user.role : null;
}

// Helper function to make authenticated API calls
async function apiCall(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============================================
// NAVIGATION UTILITIES
// ============================================
function navigateTo(page) {
  window.location.href = `pages/${page}.html`;
}

function checkAuth() {
  const token = getAuthToken();
  const role = getUserRole();
  
  if (!token || !role) {
    navigateTo('login');
    return false;
  }
  
  return true;
}

// Check if user has required role
function hasRole(requiredRole) {
  const role = getUserRole();
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(role);
  }
  return role === requiredRole;
}

function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  navigateTo('login');
}

// ============================================
// TIME FORMATTING
// ============================================
function formatTime(time) {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// ============================================
// SHOW ALERT/SUCCESS MESSAGES
// ============================================
function showAlert(message, type = 'error') {
  alert(message);
}

function showSuccess(message) {
  showAlert(message, 'success');
}

