import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Auth context to handle users from registration
import { createContext, useContext } from 'react';

// Create the auth context with extended features
const AuthContext = createContext({
  currentUser: null,
  registeredUsers: [],
  loading: true,
  login: () => Promise.resolve({ success: false }),
  logout: () => {},
  storeRegisteredUser: () => {}
});

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // API URL from environment or default
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  // Check if user is logged in on component mount and load registered users
  useEffect(() => {
    const checkAuth = async () => {
      // Check local storage for user data
      const storedUser = localStorage.getItem('currentUser');
      // Also check for legacy token storage
      const token = localStorage.getItem('token');
      
      let userData = null;
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Ensure token is set from the legacy location if needed
          if (!parsedUser.token && token) {
            parsedUser.token = token;
          }
          userData = parsedUser;
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('currentUser');
          // But keep token if it exists
        }
      } else if (token) {
        // Try to create a minimal user object from just the token
        try {
          // Try to fetch user details from API
          try {
            const response = await axios.get(`${apiUrl}/profile`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            if (response.data) {
              userData = {
                ...response.data,
                token: token,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.name || 'User')}&background=random`
              };
              // Save complete user data to localStorage
              localStorage.setItem('currentUser', JSON.stringify(userData));
            }
          } catch (apiError) {
            console.error('Error fetching user profile:', apiError);
          }
          
          // If API call failed, try to decode the JWT
          if (!userData) {
            // Simple parsing for demonstration purposes
            // For a real app you'd use a proper JWT decoder library
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            
            userData = {
              email: payload.email || 'user@example.com',
              token: token,
              name: payload.name || payload.email?.split('@')[0] || 'User'
            };
          }
        } catch (e) {
          console.error('Error processing token:', e);
          // Create minimal user object
          userData = {
            email: 'user@example.com',
            token: token,
            name: 'User',
          };
        }
      }
      
      if (userData) {
        setCurrentUser(userData);
      }
      
      // Load registered users from localStorage
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        try {
          setRegisteredUsers(JSON.parse(storedUsers));
        } catch (error) {
          console.error('Error parsing registered users:', error);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [apiUrl]);

  // Store a registered user in local cache
  const storeRegisteredUser = (userData) => {
    const newUser = {
      id: userData._id || Date.now().toString(),
      name: userData.name,
      lastName: userData.lastName || '',
      email: userData.email,
      role: userData.role || 'User',
      status: 'Active',
      joinDate: new Date().toISOString(),
      lastLogin: null,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`
    };
    
    // Check if user already exists, don't add duplicates
    const exists = registeredUsers.some(user => user.email === userData.email);
    if (exists) {
      return newUser;
    }
    
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    return newUser;
  };

  // Login function - enhanced to work with API and store user data properly
  const login = async (email, password) => {
    try {
      // Log attempt
      console.log('Attempting login with:', email);
      
      // Call API login endpoint
      const response = await axios.post(`${apiUrl}/login`, { email, password });
      
      // Handle successful response
      if (response.data && response.data.token) {
        console.log('Login successful, response:', response.data);
        
        // Also store token in legacy location for backward compatibility
        localStorage.setItem('token', response.data.token);
        
        // Try to extract user data from response or create minimal user
        let userData = {
          email: email,
          token: response.data.token,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`
        };
        
        // If we have user data in the response, use it
        if (response.data.user) {
          userData = {
            ...response.data.user,
            token: response.data.token,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.user?.name || email.split('@')[0])}&background=random`
          };
        }
        
        // Store full user data with token in local storage
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setCurrentUser(userData);
        
        // Update the user in registeredUsers if exists
        const existingUserIndex = registeredUsers.findIndex(u => u.email === email);
        if (existingUserIndex >= 0) {
          const updatedUsers = [...registeredUsers];
          updatedUsers[existingUserIndex] = {
            ...updatedUsers[existingUserIndex],
            lastLogin: new Date().toISOString()
          };
          setRegisteredUsers(updatedUsers);
          localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        } else {
          // If this is a new user we haven't seen before, add them to registeredUsers
          const newUser = {
            id: response.data.user?._id || Date.now().toString(),
            name: response.data.user?.name || email.split('@')[0],
            lastName: response.data.user?.lastName || '',
            email: email,
            role: response.data.user?.role || 'User',
            status: 'Active',
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.user?.name || email.split('@')[0])}&background=random`
          };
          
          const updatedUsers = [...registeredUsers, newUser];
          setRegisteredUsers(updatedUsers);
          localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        }
        
        // Redirect to users page on successful login
        navigate('/users');
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.data?.message || 'Login failed. Unexpected response format.'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide specific error message based on response status
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'User not found. Please check your email.';
        } else if (error.response.status === 401) {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    registeredUsers,
    loading,
    login,
    logout,
    storeRegisteredUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;