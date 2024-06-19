import React, { useState } from 'react';
import { useGetProductsQuery, useUpdateProductMutation } from '../../../../redux/productsApi';
import s from '../../productDetails.module.css';
import { Img, RenderStars } from '../../../common';
import { formatDateTime } from '../../../../utils';

export const ReviewBlock = ({ product }) => {
   const [isShowReviews, setIsShowReviews] = useState(false);
   const [isShowReviewForm, setIsShowReviewForm] = useState(false);
   const [newReview, setNewReview] = useState({ username: '', stars: 0, review: '' });
   const [updateProduct] = useUpdateProductMutation();
   const { data: productData, refetch } = useGetProductsQuery(product.id, { skip: !isShowReviews });

   const handleReviewSubmit = async (e) => {
      e.preventDefault();
      const reviewWithDate = { ...newReview, date: new Date().toISOString() };
      await updateProduct({
         productId: product.id,
         body: {
            ...productData,
            reviews: [...productData.reviews, reviewWithDate],
         },
      });
      setIsShowReviewForm(false);
      setNewReview({ username: '', stars: 0, review: '' });
      refetch();
   };

   return (
      <>
         <div className={s.btnShowHideReviews} onClick={() => setIsShowReviews(!isShowReviews)}>
            {!isShowReviews ? 'Show' : 'Hide'} Reviews
            <div className={s.arrow}>
               {isShowReviews ? <Img folder='arrows' img='up.png' /> : <Img folder='arrows' img='down.png' />}
            </div>
         </div>

         {isShowReviews && productData && (
            <div className={s.reviews}>
               {productData.reviews.map((review) => (
                  <div className={s.review} key={review.date}>
                     <div className={s.review__header}>
                        {review.username} - <RenderStars rating={review.stars} /> {review.stars}
                     </div>
                     <div className={s.review__main}>{review.review}</div>
                     <div className={s.review__footer}>{formatDateTime(review.date)}</div>
                  </div>
               ))}
            </div>
         )}

         <button className={s.btnWriteReview} onClick={() => setIsShowReviewForm(!isShowReviewForm)}>
            {isShowReviewForm ? 'Cancel' : 'Write a Review'}
         </button>

         {isShowReviewForm && (
            <form className={s.reviewForm} onSubmit={handleReviewSubmit}>
               <div>
                  <label>
                     Username:
                     <input
                        type="text"
                        value={newReview.username}
                        onChange={(e) => setNewReview({ ...newReview, username: e.target.value })}
                        required
                     />
                  </label>
               </div>
               <div>
                  <label>
                     Rating:
                     <select
                        value={newReview.stars}
                        onChange={(e) => setNewReview({ ...newReview, stars: parseInt(e.target.value) })}
                        required
                     >
                        <option value="0">Select Rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                     </select>
                  </label>
               </div>
               <div>
                  <label>
                     Review:
                     <textarea
                        value={newReview.review}
                        onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                        required
                     />
                  </label>
               </div>
               <button type="submit">Submit Review</button>
            </form>
         )}
      </>
   );
};
