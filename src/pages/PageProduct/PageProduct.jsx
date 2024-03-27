import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../../redux';
import s from './pageProduct.module.css';
import { ProductDetails, ProductNotFound } from '../../components';

export const PageProduct = () => {
   const { productId } = useParams();
   const { data: product, isLoading, error } = useGetProductsQuery(productId);

   if (error) {
      return (
         <div className="container">
            <ProductNotFound />
         </div>
      );
   }

   if (!product || isLoading) {
      return (
         <div className="container">
            <div>loading...</div>
         </div>
      );
   }

   return (
      <div className={s.pageProduct}>
         <div className="container">
            <ProductDetails product={product} />
         </div>
      </div>
   );
};
