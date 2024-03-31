import React from 'react';
import s from '../../pageCart.module.css';
import { priceWithDiscount } from '../../../../utils';

export const CartItem = ({ product, qty, handleQuantityChange, handleDeleteItem }) => {
   return (
      <tr className={s.row}>
         <td>{product.name}</td>
         <td>{priceWithDiscount(product)}</td>
         <td>
            <div className={s.quantityControl}>
               <button onClick={() => handleQuantityChange(product.id, qty - 1)} className={s.quantityButton}>-</button>
               <input
                  type="number"
                  value={qty}
                  min={0}
                  onChange={(e) => {
                     const newQuantity = parseInt(e.target.value);
                     handleQuantityChange(product.id, isNaN(newQuantity) ? 0 : newQuantity);
                  }}
                  className={s.quantityInput}
               />
               <button onClick={() => handleQuantityChange(product.id, qty + 1)} className={s.quantityButton}>+</button>
            </div>
         </td>
         <td>{(priceWithDiscount(product) * qty).toFixed(2)}</td>
         <td><button onClick={() => handleDeleteItem(product.id)} className={s.deleteButton}>Delete</button></td>
      </tr>
   );
};
