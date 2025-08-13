// src/Service/productService.js
import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:3000/api';

export class ProductService {
  static async getAllProducts() {
    try {
      const response = await axios.get(`${API_URL}/getAllProducts`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  static async getSingleProduct(id) {
    try {
      const response = await axios.get(`${API_URL}/getSingleProduct/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product with ID ${id}:`, error);
      throw error;
    }
  }

  static async addProduct(productData) {
    try {
      // Ensure we have the latest token
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('Authentication required to add products');
      }
      
      const response = await axios.post(`${API_URL}/productAdd`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to add product:', error);
      
      // Handle auth errors specifically
      if (error.response && error.response.status === 401) {
        authService.logout(); // Clear invalid token
        throw new Error('Authentication failed: Your session has expired');
      }
      
      throw error;
    }
  }

  static async updateProduct(id, productData) {
    try {
      // Ensure we have the latest token
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('Authentication required to update products');
      }
      
      const response = await axios.put(`${API_URL}/updateProduct/${id}`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Failed to update product with ID ${id}:`, error);
      
      // Handle auth errors specifically
      if (error.response && error.response.status === 401) {
        authService.logout(); // Clear invalid token
        throw new Error('Authentication failed: Your session has expired');
      }
      
      throw error;
    }
  }

  static async deleteProduct(id) {
    try {
      // Ensure we have the latest token
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('Authentication required to delete products');
      }
      
      const response = await axios.delete(`${API_URL}/deleteProduct/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Failed to delete product with ID ${id}:`, error);
      
      // Handle auth errors specifically
      if (error.response && error.response.status === 401) {
        authService.logout(); // Clear invalid token
        throw new Error('Authentication failed: Your session has expired');
      }
      
      throw error;
    }
  }

  static async validateToken() {
    try {
      // Use the token to make a request to a protected endpoint
      // If the token is invalid, it will throw a 401 error
      const token = authService.getToken();
      
      if (!token) {
        return { valid: false };
      }
      
      // Using the getAllProducts endpoint to validate the token
      // This is just a lightweight check to see if the token works
      const response = await axios.get(`${API_URL}/getAllProducts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return { valid: true };
    } catch (error) {
      console.error('Token validation failed:', error);
      
      if (error.response && error.response.status === 401) {
        // Token is invalid, clean up
        authService.logout();
      }
      
      return { valid: false, error };
    }
  }
}

export default ProductService;  