import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { averageRating, priceWithDiscount, loadFromLocalStorage, saveToLocalStorage } from '../../../utils';
import { RenderStars } from '../RenderStars';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/ToastContext';
import s from './quickView.module.css';

const getImgSrc = (img) => {
   if (!img) return '/imgs/products/not-found.png';
   if (img.startsWith('data:') || img.startsWith('http')) return img;
   return `/imgs/products/${img}`;
};

export const QuickViewModal = ({ product, onClose }) => {
   const { refreshCart } = useCart();
   const { showToast } = useToast();
   const [currentImg, setCurrentImg] = useState(0);
   const [selectedVariants, setSelectedVariants] = useState({});
   const [variantErr, setVariantErr] = useState('');

   // Close on Escape
   useEffect(() => {
      const handler = (e) => { if (e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
      return () => {
         document.removeEventListener('keydown', handler);
         document.body.style.overflow = '';
      };
   }, [onClose]);

   // Parse variants
   const variantsByType = useMemo(() => {
      const map = {};
      (product.variants || []).forEach((v) => {
         const colonIdx = v.indexOf(':');
         if (colonIdx === -1) return;
         const type  = v.slice(0, colonIdx).trim();
         const value = v.slice(colonIdx + 1).trim();
         if (!map[type]) map[type] = [];
         if (!map[type].includes(value)) map[type].push(value);
      });
      return map;
   }, [product.variants]);

   const variantTypes = Object.keys(variantsByType);
   const imgs = product.imgs?.length ? product.imgs : [null];
   const rating = averageRating(product);
   const reviewCount = (product.reviews || []).length;

   const handleAddToCart = () => {
      const missing = variantTypes.filter((t) => !selectedVariants[t]);
      if (missing.length) { setVariantErr(`Please select: ${missing.join(', ')}`); return; }
      if (product.inventory === 0) return;
      const cart = loadFromLocalStorage('cart') || {};
      cart[product.id] = (cart[product.id] || 0) + 1;
      saveToLocalStorage('cart', cart);
      refreshCart();
      showToast(`${product.name} added to cart!`, 'success');
      onClose();
   };

   return (
      <div className={s.overlay} onClick={onClose}>
         <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            {/* Close */}
            <button className={s.closeBtn} onClick={onClose} aria-label="Close">✕</button>

            <div className={s.body}>
               {/* Images */}
               <div className={s.gallery}>
                  <div className={s.mainImg}>
                     <img
                        src={getImgSrc(imgs[currentImg])}
                        alt={product.name}
                        onError={(e) => { e.target.src = '/imgs/products/not-found.png'; }}
                     />
                     {product.inventory === 0 && (
                        <div className={s.soldOutBadge}>Out of Stock</div>
                     )}
                     {product.discount > 0 && (
                        <div className={s.discountBadge}>−{(product.discount * 100).toFixed(0)}%</div>
                     )}
                  </div>
                  {imgs.length > 1 && (
                     <div className={s.thumbRow}>
                        {imgs.map((img, i) => (
                           <button
                              key={i}
                              className={`${s.thumb} ${i === currentImg ? s.thumbActive : ''}`}
                              onClick={() => setCurrentImg(i)}
                           >
                              <img src={getImgSrc(img)} alt={`thumb ${i}`} onError={(e) => { e.target.src = '/imgs/products/not-found.png'; }} />
                           </button>
                        ))}
                     </div>
                  )}
               </div>

               {/* Info */}
               <div className={s.info}>
                  {(product.category || []).length > 0 && (
                     <div className={s.categories}>
                        {product.category.map((c) => <span key={c} className={s.catTag}>{c}</span>)}
                     </div>
                  )}

                  <h2 className={s.name}>{product.name}</h2>

                  <div className={s.ratingRow}>
                     <RenderStars rating={rating} />
                     <span className={s.ratingText}>{rating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
                  </div>

                  {/* Price */}
                  <div className={s.priceBlock}>
                     {product.discount > 0 ? (
                        <>
                           <span className={s.priceNew}>{priceWithDiscount(product)} {product.currency}</span>
                           <span className={s.priceOld}>{product.price} {product.currency}</span>
                        </>
                     ) : (
                        <span className={s.priceNew}>{product.price} {product.currency}</span>
                     )}
                  </div>

                  {/* Stock */}
                  <div className={`${s.stock} ${product.inventory === 0 ? s.stockOut : product.inventory < 5 ? s.stockLow : ''}`}>
                     {product.inventory === 0 ? '✗ Out of stock' : product.inventory < 5 ? `⚠ Only ${product.inventory} left` : `✓ In stock (${product.inventory})`}
                  </div>

                  {/* Description */}
                  {product.description && (
                     <p className={s.description}>{product.description.slice(0, 180)}{product.description.length > 180 ? '…' : ''}</p>
                  )}

                  {/* Variants */}
                  {variantTypes.length > 0 && (
                     <div className={s.variants}>
                        {variantTypes.map((type) => (
                           <div key={type} className={s.variantGroup}>
                              <span className={s.variantLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}:</span>
                              <div className={s.variantBtns}>
                                 {variantsByType[type].map((val) => (
                                    <button
                                       key={val}
                                       className={`${s.variantBtn} ${selectedVariants[type] === val ? s.variantBtnActive : ''}`}
                                       onClick={() => { setSelectedVariants((p) => ({ ...p, [type]: val })); setVariantErr(''); }}
                                    >
                                       {val}
                                    </button>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
                  {variantErr && <p className={s.variantErr}>{variantErr}</p>}

                  {/* Actions */}
                  <div className={s.actions}>
                     <button
                        className={s.addToCartBtn}
                        onClick={handleAddToCart}
                        disabled={product.inventory === 0}
                     >
                        🛒 {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
                     </button>
                     <Link to={`/product/${product.id}`} className={s.detailBtn} onClick={onClose}>
                        View Full Details →
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
