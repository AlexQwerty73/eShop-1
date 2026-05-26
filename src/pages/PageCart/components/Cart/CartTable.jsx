import React from 'react';
import { CartItem } from './CartItem';

export const CartTable = ({ productsWithQty, handleQuantityChange, handleDeleteItem }) => (
   <div>
      {productsWithQty.map(({ product, qty }) => (
         <CartItem
            key={product.id}
            product={product}
            qty={qty}
            handleQuantityChange={handleQuantityChange}
            handleDeleteItem={handleDeleteItem}
         />
      ))}
   </div>
);
