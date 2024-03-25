import React from 'react';
import { ProductItem } from '../ProductItem/';
import s from './productsList.module.css';

export const ProductsList = ({ products }) => {
   return (
      <div className={s.productsList}>
         {
            products.map(product => <ProductItem key={product.id} product={product} />)
         }
      </div>
   );
};