import React from 'react';
import s from '../../productDetails.module.css';
import { Img, RenderStars } from '../../../common';
import { averageRating } from '../../../../utils';

export const ProductInfo = ({ product }) => {

   const onAddToCartHandler = () => {

   }

   return (
      <div className={s.productInfo}>
         <h1>{product.name}</h1>
         <div className={s.rating}>
            <RenderStars rating={averageRating(product)} />  {averageRating(product)} ({product.reviews ? product.reviews.length : 0})
         </div>
         <h6>Inventory: {product.inventory}</h6>
         <p>{product.description}</p>
         <hr />
         <h2>{product.price} {product.currency}</h2>
         {
            product.inventory === 0
               ? <button className={`${s.btn_buy} ${s.opac_05}`}>Add To Cart
                  <div className={s.cartImg}>
                     <Img folder='cart' img='add-to-cart.png' />
                  </div>
               </button>
               : <button onClick={() => onAddToCartHandler()} className={s.btn_buy}>Add To Cart
                  <div className={s.cartImg}>
                     <Img folder='cart' img='add-to-cart.png' alt='add to cart button' />
                  </div>
               </button>
         }
      </div>
   );
};
