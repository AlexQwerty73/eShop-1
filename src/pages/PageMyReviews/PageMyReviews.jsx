import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery, useUpdateProductMutation, useGetUsersQuery } from '../../redux';
import { useAuth } from '../../context';
import { useToast } from '../../context/ToastContext';
import { usePageTitle } from '../../hooks';
import { formatDateTime } from '../../utils';
import s from './pageMyReviews.module.css';

const StarDisplay = ({ rating }) => {
   return (
      <div className={s.stars}>
         {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= rating ? s.starFilled : s.starEmpty}>★</span>
         ))}
      </div>
   );
};

export const PageMyReviews = () => {
   usePageTitle('My Reviews');
   const { userId } = useAuth();
   const { showToast } = useToast();
   const { data: userData } = useGetUsersQuery(userId, { skip: !userId });
   const { data: allProducts = [], isLoading } = useGetProductsQuery();
   const [updateProduct] = useUpdateProductMutation();
   const [filterStars, setFilterStars] = useState(0); // 0 = all
   const [deleting, setDeleting] = useState(null);

   // Username to match reviews — prefer first+last, fall back to id
   const username = useMemo(() => {
      if (!userData) return null;
      return `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.email || String(userId);
   }, [userData, userId]);

   // Collect all reviews written by this user across all products.
   // Match by userId (new reviews) OR by username (legacy reviews without userId).
   const myReviews = useMemo(() => {
      const result = [];
      allProducts.forEach((product) => {
         (product.reviews || []).forEach((review) => {
            const matchById   = review.userId && review.userId === userId;
            const matchByName = !review.userId && username && review.username === username;
            if (matchById || matchByName) {
               result.push({ ...review, product });
            }
         });
      });
      // Sort newest first
      return result.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
   }, [allProducts, username, userId]);

   const filtered = useMemo(() => {
      if (!filterStars) return myReviews;
      return myReviews.filter((r) => r.stars === filterStars);
   }, [myReviews, filterStars]);

   const avgRating = useMemo(() => {
      if (!myReviews.length) return 0;
      return myReviews.reduce((sum, r) => sum + (r.stars || 0), 0) / myReviews.length;
   }, [myReviews]);

   const handleDeleteReview = async (review) => {
      if (!window.confirm('Delete this review?')) return;
      setDeleting(review.date);
      try {
         const updatedReviews = (review.product.reviews || []).filter((r) => r.date !== review.date);
         await updateProduct({
            productId: review.product.id,
            body: { ...review.product, reviews: updatedReviews },
         }).unwrap();
         showToast('Review deleted', 'info');
      } catch {
         showToast('Failed to delete review', 'error');
      } finally {
         setDeleting(null);
      }
   };

   if (!userId) {
      return (
         <div className="container">
            <p>Please <Link to="/login">log in</Link> to view your reviews.</p>
         </div>
      );
   }

   return (
      <div className="container">
         <div className={s.pageHeader}>
            <div>
               <h1 className={s.title}>⭐ My Reviews</h1>
               <p className={s.subtitle}>
                  {myReviews.length} review{myReviews.length !== 1 ? 's' : ''}
                  {myReviews.length > 0 && ` · Avg rating: ${avgRating.toFixed(1)} ★`}
               </p>
            </div>
         </div>

         {/* Star filter */}
         {myReviews.length > 0 && (
            <div className={s.filterRow}>
               <button
                  className={`${s.filterBtn} ${filterStars === 0 ? s.filterBtnActive : ''}`}
                  onClick={() => setFilterStars(0)}
               >
                  All ({myReviews.length})
               </button>
               {[5, 4, 3, 2, 1].map((star) => {
                  const count = myReviews.filter((r) => r.stars === star).length;
                  if (!count) return null;
                  return (
                     <button
                        key={star}
                        className={`${s.filterBtn} ${filterStars === star ? s.filterBtnActive : ''}`}
                        onClick={() => setFilterStars(star)}
                     >
                        {'★'.repeat(star)} ({count})
                     </button>
                  );
               })}
            </div>
         )}

         {isLoading ? (
            <p className={s.loading}>Loading...</p>
         ) : myReviews.length === 0 ? (
            <div className={s.empty}>
               <div className={s.emptyIcon}>💬</div>
               <p>You haven't written any reviews yet.</p>
               <Link to="/" className={s.browseBtn}>Browse Products</Link>
            </div>
         ) : filtered.length === 0 ? (
            <p className={s.noResults}>No reviews with {filterStars} star{filterStars !== 1 ? 's' : ''}.</p>
         ) : (
            <div className={s.reviewList}>
               {filtered.map((review) => (
                  <div key={`${review.product.id}-${review.date}`} className={s.card}>
                     {/* Product info */}
                     <div className={s.productSection}>
                        <Link to={`/product/${review.product.id}`} className={s.imgLink}>
                           {review.product.imgs?.[0] ? (
                              <img src={review.product.imgs[0]} alt={review.product.name} className={s.productImg} />
                           ) : (
                              <div className={s.imgPlaceholder}>📷</div>
                           )}
                        </Link>
                        <div className={s.productInfo}>
                           <Link to={`/product/${review.product.id}`} className={s.productName}>
                              {review.product.name}
                           </Link>
                           <span className={s.productPrice}>
                              {review.product.price} {review.product.currency}
                           </span>
                           {(review.product.category || []).map((c) => (
                              <span key={c} className={s.catTag}>{c}</span>
                           ))}
                        </div>
                     </div>

                     {/* Review content */}
                     <div className={s.reviewContent}>
                        <div className={s.reviewTop}>
                           <StarDisplay rating={review.stars} />
                           <span className={s.reviewDate}>{formatDateTime(review.date)}</span>
                        </div>
                        {review.review && (
                           <p className={s.reviewText}>"{review.review}"</p>
                        )}
                     </div>

                     {/* Delete */}
                     <button
                        className={s.deleteBtn}
                        onClick={() => handleDeleteReview(review)}
                        disabled={deleting === review.date}
                     >
                        {deleting === review.date ? '...' : '🗑 Delete'}
                     </button>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};
