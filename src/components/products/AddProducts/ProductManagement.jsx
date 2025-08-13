import React, { useState, useEffect } from 'react';
import ProductsGrid from './ProductsGrid';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';
import ProductViewModal from './ProductViewModal';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // API URL 
  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      fetchProducts(storedToken);
    }
  }, []);

  const fetchProducts = async (authToken) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}/getAllProducts`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      
      if (err.response) {
        setError(`Failed to fetch products: ${err.response.data?.message || 'Unknown error'}`);
        
        if (err.response.status === 401) {
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('authToken');
          setToken('');
        }
      } else if (err.request) {
        setError('Server did not respond. Please check if your backend server is running.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProductAdded = (newProduct) => {
    // Add the new product to the products list
    setProducts([...products, newProduct]);
    // Alternatively, refetch all products
    fetchProducts(token);
  };

  const handleProductUpdated = (updatedProduct) => {
    // Update the product in the products list
    setProducts(products.map(product => 
      product._id === updatedProduct._id ? updatedProduct : product
    ));
    // Close the edit modal
    setIsEditModalOpen(false);
    // Clear the selected product
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${API_URL}/deleteProduct/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove product from state
      setProducts(products.filter(product => product._id !== productId));
      
      // Close any open modals
      setIsViewModalOpen(false);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(`Failed to delete product: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Product Management</h1>
      
      <AddProductForm onProductAdded={handleProductAdded} />
      
      {token && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Product List</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {loading ? (
            <p className="text-gray-600">Loading products...</p>
          ) : (
            <ProductsGrid 
              products={products}
              onViewProduct={handleViewProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
        </div>
      )}

      {/* View Product Modal with Edit and Delete functionality */}
      <ProductViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        product={selectedProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      {/* Edit Product Modal */}
      <EditProductForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onProductUpdated={handleProductUpdated}
      />
    </div>
  );
};

export default ProductManagement;