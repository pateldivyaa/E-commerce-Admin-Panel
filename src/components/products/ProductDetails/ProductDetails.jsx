import React, { useState } from 'react';
import { format } from 'date-fns';
import { RiEditLine, RiShoppingCart2Line } from 'react-icons/ri';
import EditProductModal from '../ProductModel/EditProductModal';

const ProductDetails = ({ product }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { 
    name, 
    category, 
    price, 
    stock, 
    status, 
    description, 
    specifications, 
    images, 
    createdAt, 
    updatedAt 
  } = product;
  
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
  
  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img 
                  src={images[0]} 
                  alt={name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="p-4 grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <div 
                      key={index} 
                      className={`aspect-square rounded-md overflow-hidden border-2 ${
                        index === 0 ? 'border-primary-500' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${name} ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-500">{category}</span>
                    <span className="mx-2">•</span>
                    <span className={`badge ${getStatusClass(status)}`}>{status}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="text-2xl font-bold text-primary-600">${price.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{description}</p>
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Stock:</p>
                    <p className="font-medium">{stock} units</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Created:</p>
                    <p className="font-medium">{format(new Date(createdAt), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Updated:</p>
                    <p className="font-medium">{format(new Date(updatedAt), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Product ID:</p>
                    <p className="font-medium">#{product.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
                <button className="btn btn-primary flex-1 flex items-center justify-center">
                  <RiShoppingCart2Line className="mr-2" />
                  Update Inventory
                </button>
                <button 
                  className="btn btn-outline flex-1 flex items-center justify-center"
                  onClick={() => setShowEditModal(true)}
                >
                  <RiEditLine className="mr-2" />
                  Edit Product
                </button>
              </div>
            </div>
            
            {/* Product Specifications */}
            {specifications && Object.keys(specifications).length > 0 && (
              <div className="bg-white rounded-lg shadow-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="text-gray-600 w-32 flex-shrink-0">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        product={product}
      />
    </>
  );
};

export default ProductDetails;