import React from 'react';
import { X } from 'lucide-react';
import useProductStore from '../ProductModel/useProductStore';

const EditProductForm = ({ isOpen, onClose, product }) => {
  const { updateProduct } = useProductStore();
  const [formData, setFormData] = React.useState({
    title: '',
    price: '',
    category: '',
    description: '',
  });
  const [image, setImage] = React.useState(null);
  const [previewImage, setPreviewImage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  React.useEffect(() => {
    if (product && isOpen) {
      // Initialize form with product data when modal opens
      setFormData({
        title: product.title || '',
        price: product.price || '',
        category: product.category || '',
        description: product.description || '',
      });
      
      // Set preview image if product has an image
      if (product.image) {
        if (product.image.startsWith('http')) {
          setPreviewImage(product.image);
        } else {
          // Use environment variables for image paths
          const apiImageBase = import.meta.env.VITE_API_IMAGE || 'http://localhost:3000';
          const uploadPath = import.meta.env.VITE_UPLOAD_PATH || 'image';
          setPreviewImage(`${apiImageBase}/${uploadPath}/${product.image}`);
        }
      } else {
        setPreviewImage('');
      }
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication required. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      // Prepare form data for API
      const productData = new FormData();
      productData.append('title', formData.title);
      productData.append('price', formData.price);
      productData.append('category', formData.category);
      productData.append('description', formData.description);
      
      // Only append image if a new one is selected
      if (image) {
        productData.append('image', image);
      }

      console.log(`Updating product with ID: ${product._id}`);
      
      // Use the store's updateProduct method
      const updatedProduct = await updateProduct(product._id, productData);
      
      console.log('Product updated successfully:', updatedProduct);
      setSuccess('Product updated successfully!');
      
      // Show success message briefly before closing
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error('Error updating product:', err);
      
      if (err.name === 'AbortError') {
        setError('Request was aborted. Please try again.');
      } else if (err.message?.includes('Authentication') || err.message?.includes('401')) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('authToken');
      } else if (err.message?.includes('Connection') || err.message?.includes('Failed to fetch')) {
        setError('Server did not respond. Please check if your backend server is running.');
      } else {
        setError(`Error: ${err.message || 'Unknown error occurred'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Product Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="pl-7 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category*
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Image
                </label>
                <div className="mt-1 flex items-center">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Product preview"
                        className="h-32 w-32 object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          console.log('Image failed to load:', e.target.src);
                          e.target.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=No+Image';
                        }}
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        onClick={() => {
                          setImage(null);
                          setPreviewImage('');
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-32 w-32 bg-gray-100 rounded-md">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  <div className="ml-4">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {previewImage ? 'Change Image' : 'Upload Image'}
                    </label>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Leave empty to keep current image
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductForm;