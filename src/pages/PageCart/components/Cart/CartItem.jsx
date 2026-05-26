import React from 'react';
import s from '../../pageCart.module.css';
import { priceWithDiscount } from '../../../../utils';
import { Img } from '../../../../components/common';

export const CartItem = ({ product, qty, handleQuantityChange, handleDeleteItem }) => {
   const maxQty    = product.inventory || 1;
   const unitPrice = priceWithDiscount(product);

   return (
      <div className={s.cartItem}>
         {/* Thumbnail */}
         <div className={s.itemThumb}>
            <Img folder="products" img={product.imgs?.[0] || 'not-found.png'} alt={product.name} />
         </div>

         {/* Info */}
         <div className={s.itemInfo}>
            {product.category?.[0] && (
               <div className={s.itemCategory}>{product.category[0]}</div>
            )}
            <div className={s.itemName}>{product.name}</div>
            <div className={s.itemUnitPrice}>{unitPrice} {product.currency} / unit</div>
         </div>

         {/* Qty control */}
         <div>
            <div className={s.qtyControl}>
               <button
                  className={s.qtyBtn}
                  onClick={() => handleQuantityChange(product.id, qty - 1)}
                  disabled={qty <= 1}
               >−</button>
               <input
                  type="number"
                  className={s.qtyValue}
                  value={qty}
                  min={1}
                  max={maxQty}
                  onChange={(e) => {
                     const v = parseInt(e.target.value);
                     if (!isNaN(v)) handleQuantityChange(product.id, Math.min(Math.max(1, v), maxQty));
                  }}
               />
               <button
                  className={s.qtyBtn}
                  onClick={() => handleQuantityChange(product.id, qty + 1)}
                  disabled={qty >= maxQty}
               >+</button>
            </div>
            {qty >= maxQty && <div className={s.maxNote}>Max {maxQty}</div>}
         </div>

         {/* Total + remove */}
         <div className={s.itemRight}>
            <span className={s.itemTotal}>
               {(unitPrice * qty).toFixed(2)} {product.currency}
            </span>
            <button className={s.removeBtn} onClick={() => handleDeleteItem(product.id)}>
               ✕ Remove
            </button>
         </div>
      </div>
   );
};
