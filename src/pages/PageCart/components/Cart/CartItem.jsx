import React from 'react';
import s from '../../pageCart.module.css';
import { priceWithDiscount } from '../../../../utils';
import { Img } from '../../../../components/common';

export const CartItem = ({ product, qty, handleQuantityChange, handleDeleteItem }) => {
   const maxQty = product.inventory || 1;

   return (
      <tr className={s.row}>
         <td className={s.nameCell}>
            <div className={s.productThumb}>
               <Img folder="products" img={product.imgs?.[0] || 'not-found.png'} alt={product.name} />
            </div>
            <span>{product.name}</span>
         </td>
         <td>{priceWithDiscount(product)} {product.currency}</td>
         <td>
            <div className={s.quantityControl}>
               <button
                  onClick={() => handleQuantityChange(product.id, qty - 1)}
                  className={s.quantityButton}
                  disabled={qty <= 1}
               >-</button>
               <input
                  type="number"
                  value={qty}
                  min={1}
                  max={maxQty}
                  onChange={(e) => {
                     const val = parseInt(e.target.value);
                     if (!isNaN(val)) handleQuantityChange(product.id, Math.min(Math.max(1, val), maxQty));
                  }}
                  className={s.quantityInput}
               />
               <button
                  onClick={() => handleQuantityChange(product.id, qty + 1)}
                  className={s.quantityButton}
                  disabled={qty >= maxQty}
                  title={qty >= maxQty ? `Max available: ${maxQty}` : ''}
               >+</button>
            </div>
            {qty >= maxQty && (
               <div className={s.maxQtyNote}>Max: {maxQty}</div>
            )}
         </td>
         <td>{(priceWithDiscount(product) * qty).toFixed(2)} {product.currency}</td>
         <td><button onClick={() => handleDeleteItem(product.id)} className={s.deleteButton}>✕ Remove</button></td>
      </tr>
   );
};
