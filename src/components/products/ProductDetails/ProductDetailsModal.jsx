import React, { useState } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import { ProductImage } from '../ProductImage/ProductImage';

const ProductViewModal = ({ isOpen, onClose, product, onEdit, onDelete, isDeleting = false }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !product) return null;

  // Format price with 2 decimal places
  const formattedPrice = parseFloat(product.price).toFixed(2);

  // Handle delete confirmation
  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete(product._id || product.id);
      setConfirmDelete(false);
      onClose();
    } catch (error) {
      console.error("Failed to delete product:", error);
      // Show error message to user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  // Handle edit
  const handleEditClick = () => {
    onEdit(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <ProductImage
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{product.title}</h3>
                <p className="text-blue-600 text-sm font-medium uppercase">{product.category}</p>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">${formattedPrice}</span>
              </div>

              <div className="mb-4 border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{product.description}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Details</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-600">ID:</span>
                  <span>#{product._id || product.id}</span>
                  
                  {product.stock !== undefined && (
                    <>
                      <span className="text-gray-600">Stock:</span>
                      <span>{product.stock} units</span>
                    </>
                  )}
                  
                  {product.createdAt && (
                    <>
                      <span className="text-gray-600">Created:</span>
                      <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                    </>
                  )}
                  
                  {product.updatedAt && (
                    <>
                      <span className="text-gray-600">Updated:</span>
                      <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleEditClick}
                  className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <Edit size={18} className="mr-2" />
                  Edit Product
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="flex-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Product</h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to delete "{product.title}"? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-center gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductViewModal;