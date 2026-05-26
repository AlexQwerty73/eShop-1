import React, { createContext, useContext, useState, useCallback } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils';

const CompareContext = createContext(null);
const MAX_COMPARE = 3;
const STORAGE_KEY = 'compare';

export const CompareProvider = ({ children }) => {
   const [compareIds, setCompareIds] = useState(
      () => loadFromLocalStorage(STORAGE_KEY) || []
   );

   const addToCompare = useCallback((productId) => {
      setCompareIds((prev) => {
         if (prev.includes(productId)) return prev;
         if (prev.length >= MAX_COMPARE) return prev; // max 3
         const next = [...prev, productId];
         saveToLocalStorage(STORAGE_KEY, next);
         return next;
      });
   }, []);

   const removeFromCompare = useCallback((productId) => {
      setCompareIds((prev) => {
         const next = prev.filter((id) => id !== productId);
         saveToLocalStorage(STORAGE_KEY, next);
         return next;
      });
   }, []);

   const toggleCompare = useCallback((productId) => {
      setCompareIds((prev) => {
         if (prev.includes(productId)) {
            const next = prev.filter((id) => id !== productId);
            saveToLocalStorage(STORAGE_KEY, next);
            return next;
         }
         if (prev.length >= MAX_COMPARE) return prev;
         const next = [...prev, productId];
         saveToLocalStorage(STORAGE_KEY, next);
         return next;
      });
   }, []);

   const isInCompare = useCallback((productId) => compareIds.includes(productId), [compareIds]);

   const clearCompare = useCallback(() => {
      setCompareIds([]);
      saveToLocalStorage(STORAGE_KEY, []);
   }, []);

   return (
      <CompareContext.Provider value={{ compareIds, addToCompare, removeFromCompare, toggleCompare, isInCompare, clearCompare, maxCompare: MAX_COMPARE }}>
         {children}
      </CompareContext.Provider>
   );
};

export const useCompare = () => useContext(CompareContext);
