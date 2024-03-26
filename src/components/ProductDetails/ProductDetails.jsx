import React, { useState } from 'react';
import s from './productDetails.module.css';
import { Carousel } from './Carousel';
import { Img } from '../common';
import { formatDateTime } from '../../utils';
import RenderStars from '../common/RenderStars/RenderStars';

export const ProductDetails = ({ product }) => {
   const [isShowReviews, setIsShowReviews] = useState(false);
   const averageRating = product.reviews ? (product.reviews.reduce((a, b) => a + Number(b.stars), 0) / product.reviews.length) : 0;

   const onAddToCartHandler = () => {

   }

   return (
      <div className={s.productDetails}>
         <div className={s.basicInfo}>
            <Carousel product={product} />
            <div className={s.productInfo}>
               <h1>{product.name}</h1>
               <div className={s.rating}>
                  <RenderStars rating={averageRating} />  {averageRating} ({product.reviews ? product.reviews.length : 0})

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
                           <Img folder='cart' img='add-to-cart.png' />
                        </div>
                     </button>
               }
            </div>
         </div>
         <hr />
         <div className={s.btnShowHideReviews} onClick={() => setIsShowReviews(!isShowReviews)}>
            {!isShowReviews ? 'Show' : 'Hide'} Reviews
            <div className={s.arrow}>
               {
                  isShowReviews
                     ? <Img folder='arrows' img='up.png' />
                     : <Img folder='arrows' img='down.png' />
               }
            </div>
         </div>
         <div className={s.reviews}>
            {
               isShowReviews &&
               product.reviews.map(review => (
                  <div className={s.review} key={review.date}> 
                     <div className={s.review__header}>
                        {review.username} - <RenderStars rating={review.stars} /> {review.stars} 
                     </div>
                     <div className={s.review__main}>
                        {review.review}
                     </div>
                     <div className={s.review__footer}>
                        {formatDateTime(review.date)}
                     </div>
                  </div>
               ))
            }
         </div>
         <hr />
      </div>
   );
};
