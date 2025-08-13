import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiEditLine } from 'react-icons/ri';
import { useProductStore } from '../components/Products/ProductsModel/useProductStore';
import ProductDetails from '../components/Products/ProductDetails/ProductDetails';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading } = useProductStore();
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      const foundProduct = await getProductById(parseInt(id));
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        navigate('/products', { replace: true });
      }
    };
    
    fetchProduct();
  }, [id, getProductById, navigate]);
  
  if (loading || !product) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <RiArrowLeftLine size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-500">Product details and information</p>
          </div>
        </div>
        <button className="mt-4 md:mt-0 btn btn-primary flex items-center">
          <RiEditLine className="mr-2" />
          Edit Product
        </button>
      </div>
      
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductDetailsPage;