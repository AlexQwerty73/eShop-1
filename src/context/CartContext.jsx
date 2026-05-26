import { createContext, useContext, useState, useCallback } from 'react';
import { loadFromLocalStorage } from '../utils';

const CartContext = createContext({ cartCount: 0, refreshCart: () => {} });

const getCount = () => {
   const cart = loadFromLocalStorage('cart') || {};
   return Object.values(cart).reduce((sum, qty) => sum + Number(qty), 0);
};

export const CartProvider = ({ children }) => {
   const [cartCount, setCartCount] = useState(getCount);

   const refreshCart = useCallback(() => {
      setCartCount(getCount());
   }, []);

   return (
      <CartContext.Provider value={{ cartCount, refreshCart }}>
         {children}
      </CartContext.Provider>
   );
};

export const useCart = () => useContext(CartContext);
