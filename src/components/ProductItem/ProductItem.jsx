import React from 'react';
import s from './productItem.module.css';
import { Img } from '../common'
import { Link } from 'react-router-dom';

export const ProductItem = ({ product }) => {
   return (
      <div className={s.product}>
         <Link to={`${product.id}`}>
            <div className={s.img}>
               <Img folder='products' img={product.imgs[0] || 'not-found.png'} />
            </div>
            <div className={s.name}>{product.name}</div>
            <div className={s.price}>Price: {product.price} {product.currency}</div>
            {/* <div className={s.inventory}>Inventory: {product.inventory || 'sold out'}</div> */}
            <div className={s.rating}>Rating: {product.rating}</div>
         </Link>
      </div>
   );
};