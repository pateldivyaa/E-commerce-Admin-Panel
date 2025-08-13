import React, { useState, useEffect } from 'react';
import authService from '../../../Service/authService';
import { ProductService } from '../../../Service/productService';
import useProductStore from '../ProductModel/useProductStore';

const AddProductForm = ({ onProductAdded, onCancel, onAuthStateChange }) => {
  const { addProduct } = useProductStore();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  
  // API URL based on environment
  const API_URL = 'http://localhost:3000/api';

  // Check authentication status when the component mounts or when auth changes
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.refreshTokenFromStorage();
      setIsAuthenticated(isAuth);
      
      // Notify parent of auth state change
      if (onAuthStateChange && isAuthenticated !== isAuth) {
        onAuthStateChange(isAuth);
      }
      
      return isAuth;
    };
    
    // Initial check
    checkAuth();
    
    // Set up interval to periodically check auth status
    const interval = setInterval(checkAuth, 60 * 1000); // Check every minute
    
    return () => clearInterval(interval);
  }, [onAuthStateChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate authentication
    if (!isAuthenticated) {
      setError('Authentication required. Please log in first.');
      setLoading(false);
      return;
    }

    try {
      // Basic validation
      if (!formData.title || !formData.price || !formData.category || !formData.description) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Create FormData object for file upload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('category', formData.category);
      
      // Only append image if it exists
      if (formData.image) {
        data.append('image', formData.image);
      } else {
        setError('Image is required');
        setLoading(false);
        return;
      }

      console.log('Submitting product data:', {
        title: formData.title,
        price: formData.price,
        category: formData.category,
        description: formData.description,
        image: formData.image ? formData.image.name : 'No image'
      });
      
      // Use the product service to add the product
      const newProduct = await addProduct(data);
      
      console.log('Product added successfully:', newProduct);
      
      setSuccess('Product added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        price: '',
        description: '',
        category: '',
        image: null
      });
      
      // Reset file input
      const fileInput = document.getElementById('imageInput');
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Notify parent component
      if (onProductAdded) {
        onProductAdded(newProduct);
      }
    } catch (err) {
      console.error('Error adding product:', err);
      
      // Handle authentication errors
      if (err.message?.includes('Authentication') || err.message?.includes('session')) {
        setIsAuthenticated(false);
        setError('Authentication error: Please log in again as your session has expired.');
        
        // Notify parent of auth state change
        if (onAuthStateChange) {
          onAuthStateChange(false);
        }
      } else if (err.message?.includes('Connection')) {
        // Handle connection errors
        setError(`Server connection error: ${err.message}`);
      } else {
        // Handle other errors
        setError(`Error: ${err.message || 'Unknown error occurred'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Login form component
  const LoginForm = () => {
    const [loginData, setLoginData] = useState({
      email: '',
      password: ''
    });
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleLoginChange = (e) => {
      const { name, value } = e.target;
      setLoginData({
        ...loginData,
        [name]: value
      });
    };

    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      setLoginLoading(true);
      setLoginError('');

      try {
        // Login via the auth service
        const result = await authService.login(loginData.email, loginData.password);
        
        if (result.success) {
          setIsAuthenticated(true);
          setSuccess('Login successful! You can now add products.');
          
          // Reset login form
          setLoginData({
            email: '',
            password: ''
          });
          
          // Clear any previous errors
          setError('');
          
          // Notify parent of auth state change
          if (onAuthStateChange) {
            onAuthStateChange(true);
          }
        } else {
          setLoginError(result.message || 'Login failed');
        }
      } catch (err) {
        console.error('Login error:', err);
        
        if (err.response) {
          setLoginError(`Login failed: ${err.response.data?.message || 'Unknown error'}`);
        } else if (err.message?.includes('Connection') || err.message?.includes('Failed to fetch')) {
          setLoginError('Server connection failed. Please check if the API server is running.');
        } else {
          setLoginError(`Error: ${err.message || 'Unknown error occurred'}`);
        }
      } finally {
        setLoginLoading(false);
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        
        {loginError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {loginError}
          </div>
        )}
        
        <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loginLoading}
            >
              {loginLoading ? 'Processing...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Logout button
  const LogoutButton = () => (
    <div className="flex justify-end mb-4">
      <button
        onClick={() => {
          authService.logout();
          setIsAuthenticated(false);
          setSuccess('You have been logged out successfully.');
          
          // Notify parent of auth state change
          if (onAuthStateChange) {
            onAuthStateChange(false);
          }
        }}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Logout
      </button>
    </div>
  );

  // Server status indicator
  const ServerStatusIndicator = () => {
    const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'
    
    useEffect(() => {
      const checkServerStatus = async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          // Try a simple endpoint
          const response = await fetch(`${API_URL}/getAllProducts`, { 
            signal: controller.signal,
            method: 'HEAD'  // Lighter request just to check connection
          });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            setServerStatus('online');
            return;
          }
          setServerStatus('offline');
        } catch (error) {
          console.error('Server check error:', error);
          setServerStatus('offline');
        }
      };
      
      checkServerStatus();
      const interval = setInterval(checkServerStatus, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }, []);
    
    if (serverStatus === 'checking') {
      return (
        <div className="text-gray-600 text-sm mb-4">
          Checking server status...
        </div>
      );
    } else if (serverStatus === 'online') {
      return (
        <div className="text-green-600 text-sm mb-4 flex items-center">
          <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
          Server is online
        </div>
      );
    } else {
      return (
        <div className="text-red-600 text-sm mb-4 flex items-center">
          <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div>
          Server is offline or unreachable
        </div>
      );
    }
  };

  return (
    <div>
      <ServerStatusIndicator />
      
      {isAuthenticated ? <LogoutButton /> : <LoginForm />}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            {error.includes('Server') && (
              <div className="mt-2">
                <p className="font-bold">Server Connection Troubleshooting:</p>
                <ol className="list-decimal ml-5">
                  <li>Make sure your MongoDB server is running</li>
                  <li>Ensure your backend server is started at http://localhost:3000</li>
                  <li>Check your console for more detailed error messages</li>
                </ol>
              </div>
            )}
            {error.includes('Authentication') && (
              <div className="mt-2">
                <p>Please log in again to continue.</p>
              </div>
            )}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Product Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              name="title"
              placeholder="Product Title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={!isAuthenticated}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              disabled={!isAuthenticated}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={!isAuthenticated}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              placeholder="Product Description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              disabled={!isAuthenticated}
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Product Image
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="imageInput"
              type="file"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              required
              disabled={!isAuthenticated}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading || !isAuthenticated}
            >
              {loading ? 'Processing...' : 'Add Product'}
            </button>
            
            {!isAuthenticated && (
              <p className="text-red-500 text-sm">Please login to add products</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;