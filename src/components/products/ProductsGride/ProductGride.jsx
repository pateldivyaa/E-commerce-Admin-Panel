import React from 'react';
import { Eye, Edit, Trash2, Info } from 'lucide-react';
import useProductStore from '../ProductModel/useProductStore';
import { Plus } from "lucide-react";
import { ProductImage } from '../ProductImage/ProductImage'; // Import the new component

const ProductsGrid = ({ onEditProduct, onViewProduct, onShowDetails }) => {
  const { products, deleteProduct } = useProductStore();
  const [deletingId, setDeletingId] = React.useState(null);
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setDeletingId(id);
        await deleteProduct(id);
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product. Please try again.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Create a handler function for showing details - this ensures it's always valid
  const handleShowDetails = (id) => {
    if (onShowDetails && typeof onShowDetails === 'function') {
      onShowDetails(id);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
          <Plus size={24} />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
        <p className="text-gray-500 mt-1">Get started by adding your first product</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product._id || product.id}
          className="group bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all hover:shadow-md"
        >
          <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
            {/* Using our new ProductImage component instead of direct img tags */}
            <ProductImage 
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            
            <div className="absolute top-0 right-0 p-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onViewProduct && (
                <button
                  onClick={() => onViewProduct(product)}
                  className="p-1 bg-white/90 rounded-full hover:bg-white text-gray-700 hover:text-green-600 shadow-sm transition-colors"
                  title="Quick view"
                >
                  <Eye size={16} />
                </button>
              )}
              {/* Always render the Info button */}
              <button
                onClick={() => handleShowDetails(product._id || product.id)}
                className="p-1 bg-white/90 rounded-full hover:bg-white text-gray-700 hover:text-purple-600 shadow-sm transition-colors"
                title="View full details"
              >
                <Info size={16} />
              </button>
              <button
                onClick={() => onEditProduct(product)}
                className="p-1 bg-white/90 rounded-full hover:bg-white text-gray-700 hover:text-blue-600 shadow-sm transition-colors"
                title="Edit product"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(product._id || product.id)}
                disabled={deletingId === (product._id || product.id)}
                className={`p-1 bg-white/90 rounded-full hover:bg-white text-gray-700 hover:text-red-600 shadow-sm transition-colors ${
                  deletingId === (product._id || product.id) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Delete product"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">
              {product.category}
            </div>
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-2">{product.description}</p>
            <div className="flex justify-between items-center mt-2">
              <div className="font-bold text-lg">${parseFloat(product.price).toFixed(2)}</div>
              {/* Always render the Details text button */}
              <button 
                onClick={() => handleShowDetails(product._id || product.id)} 
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;