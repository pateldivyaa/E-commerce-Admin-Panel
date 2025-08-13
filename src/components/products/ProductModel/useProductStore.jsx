import React, { useState, useEffect } from 'react';
import { ProductService } from '../../../Service/productService';
import authService from '../../../Service/authService';

const useProductStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(authService.isAuthenticated());

  // Check authentication on mount and update
  useEffect(() => {
    // Initial authentication check
    const isAuth = authService.refreshTokenFromStorage();
    setAuthenticated(isAuth);
    
    // Fetch products on mount
    fetchProducts();
    
    // Set up authentication check interval
    const authInterval = setInterval(() => {
      const isAuthNow = authService.isAuthenticated();
      if (isAuthNow !== authenticated) {
        setAuthenticated(isAuthNow);
      }
    }, 1 * 60 * 1000); // Check every minute
    
    return () => clearInterval(authInterval);
  }, []);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the product service to get all products
      const data = await ProductService.getAllProducts();
      console.log("Fetched products:", data);
      
      // Ensure image paths are consistently formatted
      const formattedProducts = data.map(product => ({
        ...product,
        imageUrl: product.image && !product.image.startsWith('http') 
          ? `http://localhost:3000/image/${product.image}` 
          : product.image
      }));
      
      setProducts(formattedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Add a new product
  const addProduct = async (productData) => {
    // Check authentication first
    if (!authenticated) {
      setError("Authentication required");
      throw new Error("Authentication required");
    }
    
    try {
      setError(null);
      
      // If productData is already a complete product object from the API
      if (productData._id) {
        setProducts(prev => [...prev, productData]);
        return productData;
      }
      
      // Otherwise send the data to the API
      const newProduct = await ProductService.addProduct(productData);
      
      // Format the image URL
      const formattedProduct = {
        ...newProduct,
        imageUrl: newProduct.image 
          ? `http://localhost:3000/image/${newProduct.image}` 
          : null
      };
      
      setProducts(prev => [...prev, formattedProduct]);
      return formattedProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      
      // Handle authentication errors
      if (err.message?.includes('Authentication') || err.message?.includes('session')) {
        setAuthenticated(false);
      }
      
      setError(err.message || 'Failed to add product');
      throw err;
    }
  };

  // Update a product
  const updateProduct = async (id, productData) => {
    // Check authentication first
    if (!authenticated) {
      setError("Authentication required");
      throw new Error("Authentication required");
    }
    
    try {
      setError(null);
      const updatedProduct = await ProductService.updateProduct(id, productData);
      
      // Format the image URL
      const formattedProduct = {
        ...updatedProduct,
        imageUrl: updatedProduct.image 
          ? `http://localhost:3000/image/${updatedProduct.image}` 
          : null
      };
      
      setProducts(prev => 
        prev.map(product => (product._id === id ? formattedProduct : product))
      );
      
      return formattedProduct;
    } catch (err) {
      console.error('Error updating product:', err);
      
      // Handle authentication errors
      if (err.message?.includes('Authentication') || err.message?.includes('session')) {
        setAuthenticated(false);
      }
      
      setError(err.message || 'Failed to update product');
      throw err;
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    // Check authentication first
    if (!authenticated) {
      setError("Authentication required");
      throw new Error("Authentication required");
    }
    
    try {
      setError(null);
      await ProductService.deleteProduct(id);
      setProducts(prev => prev.filter(product => product._id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      
      // Handle authentication errors
      if (err.message?.includes('Authentication') || err.message?.includes('session')) {
        setAuthenticated(false);
      }
      
      setError(err.message || 'Failed to delete product');
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    authenticated,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

export default useProductStore;