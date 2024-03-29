import React from 'react';
import s from '../../productDetails.module.css';
import { Img, RenderStars } from '../../../common';
import { averageRating, loadFromLocalStorage, priceWithDiscount, saveToLocalStorage } from '../../../../utils';

export const ProductInfo = ({ product }) => {

   const onAddToCartHandler = () => {
      let cart = loadFromLocalStorage('cart');
      if (!cart) {
         cart = {};
      }
      if (cart[product.id]) {
         cart[product.id] += 1;
      } else {
         cart[product.id] = 1;
      }
      saveToLocalStorage('cart', cart)
      alert('Product added to cart successfully!');
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
         <h2>
            {
               product.discount > 0
                  ? <div className={s.discountPrice}>{priceWithDiscount(product)} {product.currency} (-{product.discount * 100}%) <span> {product.price} {product.currency}</span></div>
                  : <div className={s.price}>{product.price} {product.currency}</div>
            }
         </h2>
         {
            product.inventory === 0
               ? <button className={`${s.btn_buy} ${s.opac_05}`} disabled>Add To Cart
                  <div className={s.cartImg}>
                     <Img folder='cart' img='add-to-cart.png' />
                  </div>
               </button>
               : <button onClick={onAddToCartHandler} className={s.btn_buy}>Add To Cart
                  <div className={s.cartImg}>
                     <Img folder='cart' img='add-to-cart.png' alt='add to cart button' />
                  </div>
               </button>
         }
      </div>
   );
};
