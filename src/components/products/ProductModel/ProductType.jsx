/**
 * @typedef {Object} Product
 * @property {number} id - Unique product identifier
 * @property {string} name - Product name
 * @property {string} category - Product category
 * @property {number} price - Product price
 * @property {number} stock - Current inventory count
 * @property {'Active' | 'Low Stock' | 'Out of Stock'} status - Product status
 * @property {string} description - Detailed product description
 * @property {Object.<string, string>} specifications - Key-value pairs of product specifications
 * @property {string[]} images - Array of image URLs
 * @property {string} createdAt - Creation date in ISO format
 * @property {string} updatedAt - Last update date in ISO format
 */

/**
 * @typedef {Object} ProductFormData
 * @property {string} name - Product name
 * @property {string} category - Product category
 * @property {number|string} price - Product price
 * @property {number|string} stock - Current inventory count
 * @property {string} status - Product status
 * @property {string} description - Detailed product description
 * @property {File[]} [newImages] - New images to be uploaded
 */

// Utility function to determine product status based on stock
export const determineProductStatus = (stock) => {
  if (stock === 0) {
    return 'Out of Stock';
  } else if (stock <= 5) {
    return 'Low Stock';
  }
  return 'Active';
};