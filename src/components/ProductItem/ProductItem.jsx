import React from 'react';
import s from './productItem.module.css';

export const ProductItem = ({ product }) => {
   return (
      <div className={s.product}>
         <div className={s.name}>{product.name}</div>
         <div className={s.price}>Price: {product.price} {product.currency}</div>
         <div className={s.inventory}>Inventory: {product.inventory}</div>
         <div className={s.rating}>Rating: {product.rating}</div>
      </div>
   );
};