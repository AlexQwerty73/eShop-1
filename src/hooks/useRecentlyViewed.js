import { useState, useEffect, useCallback } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils';

const KEY = 'recentlyViewed';
const MAX = 6;

export const useRecentlyViewed = (productId) => {
   const [recent, setRecent] = useState(() => loadFromLocalStorage(KEY) || []);

   // Track current product
   useEffect(() => {
      if (!productId) return;
      setRecent((prev) => {
         const without = prev.filter((id) => id !== productId);
         const next = [productId, ...without].slice(0, MAX);
         saveToLocalStorage(KEY, next);
         return next;
      });
   }, [productId]);

   const clearRecent = useCallback(() => {
      setRecent([]);
      saveToLocalStorage(KEY, []);
   }, []);

   // Return list excluding the current product
   const ids = productId ? recent.filter((id) => id !== productId) : recent;

   return { recentIds: ids, clearRecent };
};
