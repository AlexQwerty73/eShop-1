import React from 'react';
import s from '../../pageCart.module.css';
import { CartItem } from './CartItem';

export const CartTable = ({ productsWithQty, handleQuantityChange, handleDeleteItem }) => {
   return (
      <table className={s.table}>
         <thead>
            <tr>
               <th className={s.headerCell}>Name</th>
               <th className={s.headerCell}>Price</th>
               <th className={s.headerCell}>Quantity</th>
               <th className={s.headerCell}>Total Price</th>
               <th className={s.headerCell}>Action</th>
            </tr>
         </thead>
         <tbody>
            {productsWithQty.map(({ product, qty }) => (
               <CartItem
                  key={product.id}
                  product={product}
                  qty={qty}
                  handleQuantityChange={handleQuantityChange}
                  handleDeleteItem={handleDeleteItem}
               />
            ))}
         </tbody>
      </table>
   );
};
