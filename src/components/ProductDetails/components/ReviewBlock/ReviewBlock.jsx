import React, { useState, useEffect, useMemo } from 'react';
import { useGetProductsQuery, useUpdateProductMutation } from '../../../../redux/productsApi';
import { useGetUsersQuery } from '../../../../redux';
import s from '../../productDetails.module.css';
import { Img, RenderStars } from '../../../common';
import { formatDateTime } from '../../../../utils';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../context/ToastContext';
import { Link } from 'react-router-dom';

/* Inline star picker */
const StarPicker = ({ value, onChange }) => (
   <div className={s.starPicker}>
      {[1, 2, 3, 4, 5].map((star) => (
         <button
            key={star}
            type="button"
            className={`${s.starPickerBtn} ${star <= value ? s.starPickerFilled : ''}`}
            onClick={() => onChange(star)}
            aria-label={`${star} stars`}
         >★</button>
      ))}
      {value > 0 && <span className={s.starPickerLabel}>{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}</span>}
   </div>
);

export const ReviewBlock = ({ product }) => {
   const { userId } = useAuth();
   const { showToast } = useToast();

   /* User profile — for username pre-fill & verified purchase check */
   const { data: userData } = useGetUsersQuery(userId, { skip: !userId });

   const profileName = useMemo(() => {
      if (!userData) return '';
      return `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email || '';
   }, [userData]);

   /* Has user purchased this product (non-cancelled order)? */
   const hasPurchased = useMemo(() => {
      if (!userData?.orders) return false;
      return userData.orders.some(
         (order) => !order.isCancelled &&
            (order.products || []).some((p) => String(p.id) === String(product.id))
      );
   }, [userData, product.id]);

   /* Has user already written a review? */
   const alreadyReviewed = useMemo(() => {
      if (!userId) return false;
      return (product.reviews || []).some((r) => r.userId === userId);
   }, [product.reviews, userId]);

   const [isShowReviews,    setIsShowReviews]    = useState(false);
   const [isShowReviewForm, setIsShowReviewForm] = useState(false);
   const [newReview,        setNewReview]        = useState({ username: '', stars: 0, review: '' });
   const [formError,        setFormError]        = useState('');
   const [submitSuccess,    setSubmitSuccess]    = useState(false);

   const [updateProduct] = useUpdateProductMutation();

   const needData = isShowReviews || isShowReviewForm;
   const { data: productData, refetch } = useGetProductsQuery(product.id, { skip: !needData });

   /* Auto-fill username from profile */
   useEffect(() => {
      if (profileName && !newReview.username) {
         setNewReview((prev) => ({ ...prev, username: profileName }));
      }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [profileName]);

   const handleReviewSubmit = async (e) => {
      e.preventDefault();
      setFormError('');

      if (!userId) { setFormError('You must be logged in to submit a review.'); return; }
      if (newReview.stars === 0) { setFormError('Please select a star rating.'); return; }
      if (!newReview.username.trim()) { setFormError('Please enter your name.'); return; }
      if (!newReview.review.trim()) { setFormError('Please write your review.'); return; }
      if (!productData) { setFormError('Product data not ready, please try again.'); return; }

      const reviewWithDate = {
         ...newReview,
         userId,
         verified: hasPurchased,   // ← Verified Purchase flag
         date: new Date().toISOString(),
      };

      try {
         await updateProduct({
            productId: product.id,
            body: {
               ...productData,
               reviews: [...(productData.reviews || []), reviewWithDate],
            },
         });
         setIsShowReviewForm(false);
         setNewReview({ username: profileName, stars: 0, review: '' });
         setSubmitSuccess(true);
         showToast('Review submitted!', 'success');
         setTimeout(() => setSubmitSuccess(false), 3000);
         refetch();
      } catch {
         setFormError('Failed to submit review. Please try again.');
      }
   };

   const reviews = product.reviews || [];
   const total   = reviews.length;

   /* Rating breakdown */
   const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.stars === star).length,
   }));

   return (
      <>
         {/* Toggle reviews */}
         <div className={s.btnShowHideReviews} onClick={() => setIsShowReviews(!isShowReviews)}>
            {isShowReviews ? 'Hide' : 'Show'} Reviews ({total})
            <div className={s.arrow}>
               <Img folder="arrows" img={isShowReviews ? 'up.png' : 'down.png'} />
            </div>
         </div>

         {/* Rating breakdown */}
         {isShowReviews && total > 0 && (
            <div className={s.ratingBreakdown}>
               {ratingCounts.map(({ star, count }) => (
                  <div key={star} className={s.ratingRow}>
                     <span className={s.ratingRowLabel}>{star}★</span>
                     <div className={s.ratingBar}>
                        <div className={s.ratingBarFill} style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }} />
                     </div>
                     <span className={s.ratingRowCount}>{count}</span>
                  </div>
               ))}
            </div>
         )}

         {/* Reviews list */}
         {isShowReviews && productData && (
            <div className={s.reviews}>
               {productData.reviews && productData.reviews.length > 0 ? (
                  [...productData.reviews].reverse().map((review) => (
                     <div className={s.review} key={review.date}>
                        <div className={s.review__header}>
                           <strong>{review.username}</strong>
                           &nbsp;—&nbsp;
                           <RenderStars rating={review.stars} />
                           &nbsp;{review.stars}/5
                           {/* Verified Purchase badge */}
                           {review.verified
                              ? <span className={s.verifiedBadge}>✅ Verified Purchase</span>
                              : <span className={s.unverifiedBadge}>👤 Not Purchased</span>
                           }
                        </div>
                        <div className={s.review__main}>{review.review}</div>
                        <div className={s.review__footer}>{formatDateTime(review.date)}</div>
                     </div>
                  ))
               ) : (
                  <p>No reviews yet. Be the first!</p>
               )}
            </div>
         )}

         {/* Write review CTA */}
         {!userId ? (
            /* Not logged in */
            <p className={s.loginPromptInline}>
               <Link to="/login">Log in</Link> to write a review.
            </p>
         ) : alreadyReviewed ? (
            /* Already reviewed */
            <p className={s.alreadyReviewed}>✓ You have already reviewed this product.</p>
         ) : (
            /* Logged in, not reviewed yet */
            <>
               {/* Purchase status note */}
               <div className={hasPurchased ? s.purchasedNote : s.notPurchasedNote}>
                  {hasPurchased
                     ? '✅ You purchased this product — your review will show Verified Purchase'
                     : '👤 You haven\'t purchased this product — your review will be marked as unverified'
                  }
               </div>

               <button
                  className={s.btnWriteReview}
                  onClick={() => { setIsShowReviewForm((v) => !v); setFormError(''); }}
               >
                  {isShowReviewForm ? 'Cancel' : '✏ Write a Review'}
               </button>
            </>
         )}

         {submitSuccess && (
            <div style={{ color: '#2e7d32', marginTop: 8, fontWeight: 500 }}>✓ Review submitted successfully!</div>
         )}

         {/* Review form */}
         {isShowReviewForm && userId && !alreadyReviewed && (
            <form className={s.reviewForm} onSubmit={handleReviewSubmit}>
               {/* Star picker */}
               <div className={s.reviewField}>
                  <label className={s.reviewFieldLabel}>Rating *</label>
                  <StarPicker value={newReview.stars} onChange={(v) => setNewReview({ ...newReview, stars: v })} />
               </div>

               {/* Name (pre-filled, editable) */}
               <div className={s.reviewField}>
                  <label className={s.reviewFieldLabel}>Your name *</label>
                  <input
                     type="text"
                     value={newReview.username}
                     onChange={(e) => setNewReview({ ...newReview, username: e.target.value })}
                     placeholder="Your name"
                     className={s.reviewInput}
                  />
               </div>

               {/* Review text */}
               <div className={s.reviewField}>
                  <label className={s.reviewFieldLabel}>Review *</label>
                  <textarea
                     value={newReview.review}
                     onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                     placeholder="Share your experience with this product..."
                     rows={4}
                     className={s.reviewInput}
                  />
               </div>

               {formError && <p className={s.reviewError}>{formError}</p>}

               <button type="submit" className={s.reviewSubmitBtn}>Submit Review</button>
            </form>
         )}
      </>
   );
};
