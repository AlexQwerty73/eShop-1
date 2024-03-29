import { useGetProductsQuery } from '../redux';
import { useEffect, useState } from 'react';

export const useFoundProductById = (cart) => {
   const [productsWithQty, setProductsWithQty] = useState([]);

   const { data: fetchedProducts, isLoading, error } = useGetProductsQuery();

   useEffect(() => {
      if (fetchedProducts) {
         const updatedProducts = Object.entries(cart).map(([productId, qty]) => {
            const product = fetchedProducts.find(p => p.id === productId);
            if (product) {
               return { product, qty };
            }
            return null;
         }).filter(Boolean);
         setProductsWithQty(updatedProducts);
      }
   }, [fetchedProducts]);

   return productsWithQty;
};
