// src/Service/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.tokenExpiry = localStorage.getItem('tokenExpiry');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      if (response.data && response.data.token) {
        this.token = response.data.token;
        this.user = response.data.user || { email };
        
        // Set token expiry (24 hours from now)
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 24);
        this.tokenExpiry = expiryTime.getTime();
        
        // Save to localStorage
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('tokenExpiry', this.tokenExpiry);
        localStorage.setItem('user', JSON.stringify(this.user));
        
        return {
          success: true,
          user: this.user
        };
      }
      
      return {
        success: false,
        message: 'Login failed: Invalid response'
      };
    } catch (error) {
      console.error('Login error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        error
      };
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    this.tokenExpiry = null;
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    
    return true;
  }

  isAuthenticated() {
    // Check if token exists
    if (!this.token) {
      return false;
    }
    
    // Check if token is expired
    if (this.tokenExpiry) {
      const now = new Date().getTime();
      if (now > parseInt(this.tokenExpiry)) {
        // Token expired, clear everything
        this.logout();
        return false;
      }
    }
    
    return true;
  }

  getToken() {
    // Refresh from localStorage in case it was updated elsewhere
    const storedToken = localStorage.getItem('authToken');
    if (storedToken && storedToken !== this.token) {
      this.token = storedToken;
    }
    
    return this.token;
  }

  getAuthHeader() {
    return this.isAuthenticated() ? { 'Authorization': `Bearer ${this.token}` } : {};
  }

  refreshTokenFromStorage() {
    this.token = localStorage.getItem('authToken');
    this.tokenExpiry = localStorage.getItem('tokenExpiry');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    return this.isAuthenticated();
  }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;