import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Card with elegant shadow and rounded corners */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
          {/* Image Container with aspect ratio */}
          <div className="relative overflow-hidden aspect-[3/4]">
            {/* Background image pattern overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-100/60 via-transparent to-stone-100/40 z-0"></div>
            
            {/* Product Image with zoom effect */}
            <img 
              src={product.image} 
              alt={product.name} 
              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out z-10"
            />
            
            {/* Discount Tag with premium design */}
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-rose-600 text-white font-medium py-1 px-3 rounded-full shadow-lg flex items-center">
                  <span className="text-xs">{product.discount}% OFF</span>
                </div>
              </div>
            )}
            
            {/* Free Shipping Tag */}
            {product.freeShipping && (
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-amber-500 text-white font-medium py-1 px-3 rounded-full shadow-md flex items-center">
                  <span className="text-xs">FREE SHIPPING</span>
                </div>
              </div>
            )}
            
            {/* Actions Overlay - Floating buttons */}
            <div className="absolute bottom-4 inset-x-0 z-20 px-4 transition-all duration-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
              <div className="flex items-center justify-between gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
                  onClick={handleAddToCart}
                >
                  <FiShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-lg hover:bg-amber-50 transition-colors"
                  aria-label="Add to wishlist"
                >
                  <FiHeart className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Product Info with refined typography */}
          <div className="p-4">
            {/* Breadcrumb category */}
            <div className="mb-2">
              <span className="text-xs text-stone-500 font-medium uppercase tracking-wider">
                {product.category || "Luxury Collection"}
              </span>
            </div>
            
            {/* Product Title */}
            <h3 className="font-serif text-lg font-medium text-stone-900 mb-2 group-hover:text-amber-800 transition-colors">
              {product.name}
            </h3>
            
            {/* Rating Stars */}
            <div className="flex items-center mb-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg 
                  key={index} 
                  className={`w-4 h-4 ${index < product.rating ? 'text-amber-400' : 'text-stone-200'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-xs text-stone-500 ml-2">({product.reviewCount})</span>
            </div>
            
            {/* Price Section with subtle divider */}
            <div className="pt-2 border-t border-stone-100">
              <div className="flex items-baseline">
                {product.discount > 0 ? (
                  <>
                    <span className="text-lg font-medium text-stone-900">${((product.price * (100 - product.discount)) / 100).toFixed(2)}</span>
                    <span className="text-sm text-stone-400 line-through ml-2">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-lg font-medium text-stone-900">${product.price.toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick View Button - Appears on hover */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/80 backdrop-blur-sm text-stone-900 px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          >
            <FiEye className="w-4 h-4" />
            <span className="font-medium text-sm">Quick View</span>
          </motion.div>
        </div>
      </Link>
      
      {/* Sale Timer if applicable */}
      {product.saleEndsIn && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
          Sale ends in {product.saleEndsIn}
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;