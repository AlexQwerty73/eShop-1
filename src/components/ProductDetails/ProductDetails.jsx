import React from 'react';
import s from './productDetails.module.css';
import { Carousel } from '../common';
import { ProductInfo } from './components/ProductInfo';
import { ReviewBlock } from './components/ReviewBlock/ReviewBlock';

export const ProductDetails = ({ product }) => {


   return (
      <div className={s.productDetails}>
         <div className={s.basicInfo}>

            <Carousel imgs={product.imgs} />
            <ProductInfo product={product} />

         </div>

         <hr />

         <ReviewBlock product={product} />

         <hr />
      </div>
   );
};
