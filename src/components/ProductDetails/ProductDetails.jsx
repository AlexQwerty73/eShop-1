import React from 'react';
import s from './productDetails.module.css';
import { Carousel } from '../common';
import { ProductInfo } from './components/ProductInfo';
import { ReviewBlock } from './components/ReviewBlock/ReviewBlock';
import { useGetProductsQuery } from '../../redux';
import { ProductsList } from '../ProductsList';

export const ProductDetails = ({ product }) => {
   // Reuse the already-cached all-products query (no extra network request)
   const { data: allProducts = [] } = useGetProductsQuery();

   const similarProducts = allProducts.filter(
      (p) =>
         p.id !== product.id &&
         (p.category || []).some((cat) => (product.category || []).includes(cat))
   ).slice(0, 4);

   return (
      <div className={s.productDetails}>
         <div className={s.basicInfo}>
            <Carousel imgs={product.imgs} />
            <ProductInfo product={product} />
         </div>

         <hr />
         <ReviewBlock product={product} />
         <hr />

         {similarProducts.length > 0 && (
            <div className={s.similarSection}>
               <h2>Similar Products</h2>
               <ProductsList products={similarProducts} />
            </div>
         )}
      </div>
   );
};
