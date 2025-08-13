import React, { useState, useEffect } from 'react';

export const ProductImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [error, setError] = useState(false);
  
  // Get base URL from environment
  const API_IMAGE_URL = import.meta.env.VITE_API_IMAGE || 'http://localhost:3000';
  
  useEffect(() => {
    if (!src) {
      setError(true);
      return;
    }

    // Reset error state when src changes
    setError(false);
    
    // Handle different image path formats
    if (src.startsWith('http')) {
      // Already a full URL
      setImageSrc(src);
    } else if (src.startsWith('/uploads/')) {
      // Path that starts with /uploads/
      setImageSrc(`${API_IMAGE_URL}${src}`);
    } else if (src.startsWith('uploads/')) {
      // Path that starts with uploads/ without leading slash
      setImageSrc(`${API_IMAGE_URL}/${src}`);
    } else {
      // Assume it's a relative path needing the full URL
      setImageSrc(`${API_IMAGE_URL}/image/${src}`);
    }
  }, [src]);

  // Handle image loading error
  const handleError = () => {
    console.error(`Failed to load image: ${imageSrc}`);
    setError(true);
  };

  if (error || !imageSrc) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
    );
  }

  return (
    <img 
      src={imageSrc}
      alt={alt || 'Product image'}
      className={className}
      onError={handleError}
    />
  );
};