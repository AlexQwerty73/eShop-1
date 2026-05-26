import React, { memo, useState } from 'react';
import s from './productItem.module.css';
import { Img, RenderStars } from '../common';
import { QuickViewModal } from '../common/QuickView';
import { Link } from 'react-router-dom';
import { averageRating, priceWithDiscount } from '../../utils';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const ProductItem = memo(({ product }) => {
   const { price, discount, name, currency } = product;
   const { toggleWishlist, isInWishlist } = useWishlist();
   const { toggleCompare, isInCompare, compareIds, maxCompare } = useCompare();
   const { showToast } = useToast();
   const { userId, isAdmin } = useAuth();
   const canEdit = userId && (isAdmin || product.seller_id === userId);
   const [quickViewOpen, setQuickViewOpen] = useState(false);

   const inWishlist = isInWishlist(product.id);
   const inCompare  = isInCompare(product.id);
   const rating     = averageRating(product);
   const reviewCount = (product.reviews || []).length;
   const discountPct = discount > 0 ? Math.round(discount * 100) : 0;

   const handleWishlistClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist(product.id);
      showToast(
         inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
         inWishlist ? 'info' : 'success'
      );
   };

   const handleCompareClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!inCompare && compareIds.length >= maxCompare) {
         showToast(`Max ${maxCompare} products to compare`, 'warning');
         return;
      }
      toggleCompare(product.id);
      showToast(
         inCompare ? 'Removed from compare' : 'Added to compare',
         inCompare ? 'info' : 'success'
      );
   };

   return (
      <div className={s.product}>

         {/* ── Image area ── */}
         <div className={s.imgWrap}>
            <Link to={`product/${product.id}`} className={s.imgLink}>
               <Img
                  folder="products"
                  img={product.imgs?.[0] || 'not-found.png'}
                  alt={name}
               />
            </Link>

            {/* Discount badge */}
            {discountPct > 0 && (
               <span className={s.discountBadge}>-{discountPct}%</span>
            )}

            {/* Out of stock */}
            {product.inventory === 0 && (
               <div className={s.outOfStockOverlay}>
                  <span className={s.outOfStockLabel}>Out of stock</span>
               </div>
            )}

            {/* Seller badge */}
            {product.seller_id && (
               <span className={s.sellerBadge}>🏪 Seller</span>
            )}

            {/* Icon buttons: wishlist / compare / edit */}
            <div className={s.overlayActions}>
               <button
                  className={`${s.iconBtn} ${inWishlist ? s.wishlistActive : ''}`}
                  onClick={handleWishlistClick}
                  title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-label="Toggle wishlist"
               >
                  {inWishlist ? '♥' : '♡'}
               </button>

               <button
                  className={`${s.iconBtn} ${inCompare ? s.compareActive : ''}`}
                  onClick={handleCompareClick}
                  title={inCompare ? 'Remove from compare' : 'Add to compare'}
                  aria-label="Toggle compare"
               >
                  ⚖
               </button>

               {canEdit && (
                  <Link
                     to={`/sell/edit/${product.id}`}
                     className={s.iconBtn}
                     title="Edit product"
                     onClick={(e) => e.stopPropagation()}
                  >
                     ✏️
                  </Link>
               )}
            </div>

            {/* Quick View slide-up */}
            <div className={s.quickViewOverlay}>
               <button
                  className={s.quickViewBtn}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickViewOpen(true); }}
               >
                  Quick View
               </button>
            </div>
         </div>

         {/* ── Card body ── */}
         <Link to={`product/${product.id}`} className={s.bodyLink}>
            <div className={s.body}>
               {product.category?.[0] && (
                  <span className={s.category}>{product.category[0]}</span>
               )}

               <h3 className={s.name}>{name}</h3>

               <div className={s.ratingRow}>
                  <RenderStars rating={rating} />
                  {reviewCount > 0 && <span>({reviewCount})</span>}
               </div>

               <div className={s.priceRow}>
                  {discountPct > 0 ? (
                     <>
                        <span className={s.priceDiscount}>{priceWithDiscount(product)} {currency}</span>
                        <span className={s.oldPrice}>{price} {currency}</span>
                     </>
                  ) : (
                     <span className={s.price}>{price} {currency}</span>
                  )}
               </div>
            </div>
         </Link>

         {quickViewOpen && (
            <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
         )}
      </div>
   );
});

ProductItem.displayName = 'ProductItem';
