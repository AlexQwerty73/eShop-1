import { createContext, useContext, useState, useCallback } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils';

const WishlistContext = createContext({
   wishlist: [],
   toggleWishlist: () => {},
   isInWishlist: () => false,
});

export const WishlistProvider = ({ children }) => {
   const [wishlist, setWishlist] = useState(() => loadFromLocalStorage('wishlist') || []);

   const toggleWishlist = useCallback((productId) => {
      setWishlist((prev) => {
         const next = prev.includes(productId)
            ? prev.filter((id) => id !== productId)
            : [...prev, productId];
         saveToLocalStorage('wishlist', next);
         return next;
      });
   }, []);

   const isInWishlist = useCallback(
      (productId) => wishlist.includes(productId),
      [wishlist]
   );

   return (
      <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
         {children}
      </WishlistContext.Provider>
   );
};

export const useWishlist = () => useContext(WishlistContext);
