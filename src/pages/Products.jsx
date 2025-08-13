import React, { useState, useEffect } from 'react';
import ProductsGrid from '../components/products/ProductsGride/ProductGride';
import useProductStore from '../components/products/ProductModel/useProductStore';
import EditProductModal from '../components/products/EditProductModal/EditProductModal';
import AddProductForm from '../components/products/AddProducts/AddProductModal';
import ProductViewModal from '../components/products/ProductDetails/ProductDetailsModal';
import { AlertCircle, RefreshCw, PlusCircle, LogIn } from 'lucide-react';
import authService from '../Service/authService';

const ProductsPage = () => {
  const { 
    products, 
    loading, 
    error, 
    authenticated,
    fetchProducts, 
    updateProduct,
    deleteProduct 
  } = useProductStore();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Clear errors when component mounts or dependencies change
  useEffect(() => {
    setActionError(null);
  }, [products]);

  // Edit product handler - improved with direct state access
  const handleEditProduct = (product) => {
    // Check authentication first
    if (!authenticated) {
      setActionError("Please log in to edit products");
      return;
    }
    
    console.log("Edit product called with:", product);
    setProductToEdit(product);
    setIsEditModalOpen(true);
    // Close view modal if it's open
    setIsViewModalOpen(false);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setProductToEdit(null);
  };

  // Show details handler - improved with direct access to products
  const handleShowDetails = (productId) => {
    console.log("Show details for product:", productId);
    // Find the product by ID from our current state rather than using getState()
    const product = products.find(p => (p._id || p.id) === productId);
    
    if (product) {
      setSelectedProduct(product);
      setIsViewModalOpen(true);
    } else {
      console.error("Product not found with ID:", productId);
      setActionError("Product details not found");
    }
  };

  // View product handler
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  // Close view modal
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedProduct(null);
  };

  // Delete product handler with improved error handling
  const handleDeleteProduct = async (productId) => {
    // Check authentication first
    if (!authenticated) {
      setActionError("Please log in to delete products");
      return;
    }
    
    console.log("Deleting product:", productId);
    setIsProcessing(true);
    setActionError(null);
    
    try {
      // Direct deleteProduct call with optimistic update
      await deleteProduct(productId);
      console.log("Product deleted successfully");
      
      // Close the modal after successful deletion
      setIsViewModalOpen(false);
      setSelectedProduct(null);
      
      // No need to call fetchProducts here as the store already updates the state
    } catch (error) {
      console.error("Error deleting product:", error);
      setActionError(error.message || "Failed to delete product");
      // Don't close the modal on error so user can try again
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle product update with proper error handling
  const handleUpdateProduct = async (id, productData) => {
    // Check authentication first
    if (!authenticated) {
      setActionError("Please log in to update products");
      return;
    }
    
    setIsProcessing(true);
    setActionError(null);
    
    try {
      await updateProduct(id, productData);
      setIsEditModalOpen(false);
      setProductToEdit(null);
    } catch (error) {
      console.error("Error updating product:", error);
      setActionError(error.message || "Failed to update product");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle product added with proper state management
  const handleProductAdded = () => {
    // No need to manually call fetchProducts as the store already updates the state
    setShowAddForm(false);
  };

  // Manually refresh products list with loading state
  const handleRefresh = async () => {
    setRefreshing(true);
    setActionError(null);
    
    try {
      await fetchProducts();
    } catch (error) {
      setActionError(error.message || "Failed to refresh products");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle login button click
  const handleLoginClick = () => {
    // In a real app, this would redirect to login page or open login modal
    setShowAddForm(true); // Show add form which has login functionality
    setIsAuthenticating(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Header with improved layout and refresh button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleRefresh}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded flex items-center justify-center"
            disabled={loading || refreshing}
          >
            <RefreshCw size={18} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          {authenticated ? (
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
            >
              <PlusCircle size={18} className="mr-2" />
              {showAddForm ? 'Hide Form' : 'Add New Product'}
            </button>
          ) : (
            <button 
              onClick={handleLoginClick}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
            >
              <LogIn size={18} className="mr-2" />
             Add Products
            </button>
          )}
        </div>
      </div>
      
      {/* Authentication status message */}
      {!authenticated && !isAuthenticating && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md flex items-start">
          <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold">Authentication Required</p>
            <p>Please log in to add, edit, or delete products</p>
          </div>
        </div>
      )}
      
      {/* Error message display */}
      {(error || actionError) && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
          <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold">Error</p>
            <p>{actionError || error}</p>
          </div>
        </div>
      )}
      
      {/* Add product form with improved toggle */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <AddProductForm 
            onProductAdded={handleProductAdded} 
            onCancel={() => setShowAddForm(false)}
            onAuthStateChange={(isAuth) => {
              // Update authentication state after login/logout
              setIsAuthenticating(false);
              if (isAuth) {
                // Refresh products after login
                fetchProducts();
              }
            }}
          />
        </div>
      )}
      
      {/* Loading state for initial data load */}
      {loading && !products.length ? (
        <div className="space-y-4">
          <div className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      ) : (
        <ProductsGrid 
          onEditProduct={handleEditProduct}
          onViewProduct={handleViewProduct}
          onShowDetails={handleShowDetails}
          isLoading={refreshing}
        />
      )}
      
      {/* Edit modal with improved error handling */}
      {isEditModalOpen && productToEdit && (
        <EditProductModal 
          product={productToEdit}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateProduct}
          isProcessing={isProcessing}
          error={actionError}
        />
      )}

      {/* Product View Modal with improved props */}
      {isViewModalOpen && selectedProduct && (
        <ProductViewModal 
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          product={selectedProduct}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          isDeleting={isProcessing}
          error={actionError}
          authenticated={authenticated}
        />
      )}
    </div>
  );
};

export default ProductsPage;