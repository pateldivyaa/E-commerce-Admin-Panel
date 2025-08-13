import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RiEditLine, 
  RiDeleteBin6Line, 
  RiEyeLine,
} from 'react-icons/ri';
import ProductDetailsModal from '../ProductDetails/ProductDetailsModal';
import EditProductModal from '../EditProductModal/EditProductModal';
import useProductStore from '../ProductModel/useProductStore';
import toast from 'react-hot-toast';

const ProductCard = ({ product, viewMode }) => {
  const { deleteProduct } = useProductStore();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'badge-success';
      case 'Low Stock':
        return 'badge-warning';
      case 'Out of Stock':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  };
  
  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      toast.success('Product deleted successfully');
      setShowDeleteConfirm(false);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };
  
  // Updated handler to open the edit modal
  const handleEdit = () => {
    setShowEditModal(true);
  };
  
  if (viewMode === 'list') {
    return (
      <>
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center">
            <div className="w-full sm:w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="sm:ml-6 flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 sm:mb-0">{product.name}</h3>
                <span className={`badge ${getStatusClass(product.status)} mt-2 sm:mt-0`}>{product.status}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{product.category}</p>
                  <p className="text-primary-600 font-medium">${product.price.toFixed(2)}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
                  <button 
                    className="btn btn-sm btn-outline py-1"
                    onClick={() => setShowModal(true)}
                  >
                    <RiEyeLine className="mr-1" /> View
                  </button>
                  <button 
                    className="btn btn-sm btn-outline py-1"
                    onClick={handleEdit}
                  >
                    <RiEditLine className="mr-1" /> Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-outline py-1 text-error-600 border-error-600 hover:bg-error-50"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <RiDeleteBin6Line className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Modal */}
        <ProductDetailsModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          productId={product.id} 
        />
        
        {/* Edit Product Modal */}
        <EditProductModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          product={product}
        />
        
        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <RiDeleteBin6Line size={24} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Delete Product</h2>
                <p className="text-gray-500 mt-2">
                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-center space-x-3">
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </>
    );
  }
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="relative h-48 bg-gray-200">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <span className={`absolute top-2 right-2 badge ${getStatusClass(product.status)}`}>
            {product.status}
          </span>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
          <p className="text-gray-500 text-sm">{product.category}</p>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-primary-600 font-medium">${product.price.toFixed(2)}</p>
            <p className="text-gray-500 text-sm">Stock: {product.stock}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button 
              className="btn btn-sm btn-outline py-1 flex-1"
              onClick={() => setShowModal(true)}
            >
              <RiEyeLine className="mr-1" /> View
            </button>
            <button 
              className="btn btn-sm btn-outline py-1 flex-1"
              onClick={handleEdit}
            >
              <RiEditLine className="mr-1" /> Edit
            </button>
            <button 
              className="btn btn-sm btn-outline py-1 text-error-600 border-error-600 hover:bg-error-50"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        </div>
      </div>
      
      {/* Product Details Modal */}
      <ProductDetailsModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        productId={product.id} 
      />
      
      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        product={product}
      />
      
      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <RiDeleteBin6Line size={24} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delete Product</h2>
              <p className="text-gray-500 mt-2">
                Are you sure you want to delete "{product.name}"? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-center space-x-3">
              <button 
                className="btn btn-outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ProductCard;