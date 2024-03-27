import React, { useState } from 'react';
import s from '../../productDetails.module.css';
import { Img, RenderStars } from '../../../common';
import { formatDateTime } from '../../../../utils';

export const ReviewBlock = ({ product }) => {
   const [isShowReviews, setIsShowReviews] = useState(false);

   return (
      <>
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
      </>
   );
};