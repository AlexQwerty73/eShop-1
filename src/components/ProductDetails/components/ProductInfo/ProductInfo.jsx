import React, { useState, useMemo } from 'react';
import s from '../../productDetails.module.css';
import { Img, RenderStars } from '../../../common';
import { averageRating, loadFromLocalStorage, priceWithDiscount, saveToLocalStorage } from '../../../../utils';
import { useCart } from '../../../../context/CartContext';
import { useToast } from '../../../../context/ToastContext';
import { useAuth } from '../../../../context/AuthContext';
import { Link } from 'react-router-dom';

export const ProductInfo = ({ product }) => {
   const { refreshCart } = useCart();
   const { showToast } = useToast();
   const { userId, isAdmin } = useAuth();
   const canEdit = userId && (isAdmin || product.seller_id === userId);

   // Parse variants: ["color:blue", "size:M"] → { color: ["blue"], size: ["M"] }
   const variantsByType = useMemo(() => {
      const map = {};
      (product.variants || []).forEach((v) => {
         const colonIdx = v.indexOf(':');
         if (colonIdx === -1) return;
         const type = v.slice(0, colonIdx).trim();
         const value = v.slice(colonIdx + 1).trim();
         if (!map[type]) map[type] = [];
         if (!map[type].includes(value)) map[type].push(value);
      });
      return map;
   }, [product.variants]);

   const [selectedVariants, setSelectedVariants] = useState({});
   const [addedMsg,  setAddedMsg]  = useState('');
   const [variantErr, setVariantErr] = useState('');

   const variantTypes = Object.keys(variantsByType);

   const handleVariantSelect = (type, value) => {
      setSelectedVariants((prev) => ({ ...prev, [type]: value }));
      setVariantErr('');
   };

   const onAddToCartHandler = () => {
      // Check all variant types are selected
      const missing = variantTypes.filter((t) => !selectedVariants[t]);
      if (missing.length > 0) {
         setVariantErr(`Please select: ${missing.join(', ')}`);
         return;
      }

      let cart = loadFromLocalStorage('cart') || {};
      if (cart[product.id]) {
         cart[product.id] += 1;
      } else {
         cart[product.id] = 1;
      }
      saveToLocalStorage('cart', cart);
      refreshCart();
      setAddedMsg('✓ Added to cart!');
      setVariantErr('');
      showToast(`${product.name} added to cart!`, 'success');
      setTimeout(() => setAddedMsg(''), 2000);
   };

   return (
      <div className={s.productInfo}>
         <h1>{product.name}</h1>
         <div className={s.rating}>
            <RenderStars rating={averageRating(product)} />
            &nbsp;{averageRating(product)} ({product.reviews ? product.reviews.length : 0} reviews)
         </div>
         <h6>Inventory: {product.inventory > 0 ? product.inventory : <span style={{ color: 'tomato' }}>Out of stock</span>}</h6>
         <p>{product.description}</p>

         {/* Seller commission info */}
         {product.seller_id && product.commission_rate > 0 && (
            <div className={s.sellerInfo}>
               <small>🏪 Sold by a marketplace seller · {(product.commission_rate * 100).toFixed(0)}% platform fee</small>
            </div>
         )}

         <hr />

         {/* Variants */}
         {Object.keys(variantsByType).length > 0 && (
            <div className={s.variants}>
               {Object.entries(variantsByType).map(([type, values]) => (
                  <div key={type} className={s.variantGroup}>
                     <div className={s.variantLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}:</div>
                     <div className={s.variantButtons}>
                        {values.map((val) => (
                           <button
                              key={val}
                              className={`${s.variantBtn} ${selectedVariants[type] === val ? s.variantBtnActive : ''}`}
                              onClick={() => handleVariantSelect(type, val)}
                           >
                              {val}
                           </button>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         )}

         <h2>
            {product.discount > 0 ? (
               <div className={s.discountPrice}>
                  {priceWithDiscount(product)} {product.currency}
                  &nbsp;(-{(product.discount * 100).toFixed(0)}%)
                  <span> {product.price} {product.currency}</span>
               </div>
            ) : (
               <div className={s.price}>{product.price} {product.currency}</div>
            )}
         </h2>

         {product.inventory === 0 ? (
            <button className={`${s.btn_buy} ${s.opac_05}`} disabled>
               Out of Stock
               <div className={s.cartImg}><Img folder="cart" img="add-to-cart.png" /></div>
            </button>
         ) : (
            <button onClick={onAddToCartHandler} className={s.btn_buy}>
               Add To Cart
               <div className={s.cartImg}><Img folder="cart" img="add-to-cart.png" alt="add to cart" /></div>
            </button>
         )}

         {variantErr && <div style={{ color: 'tomato', marginTop: 8, fontSize: 14 }}>{variantErr}</div>}
         {addedMsg && <div className={s.addedMsg}>{addedMsg}</div>}

         {/* Edit button — visible to owner and admin */}
         {canEdit && (
            <Link to={`/sell/edit/${product.id}`} className={s.editProductBtn}>
               ✏️ Edit Product
            </Link>
         )}
      </div>
   );
};
