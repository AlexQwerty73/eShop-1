import React from 'react';
import { ProductsList } from '../../components';
import { useGetProductsQuery } from '../../redux';

export const PageHome = () => {
   const { data: productsData = [], isLoading } = useGetProductsQuery();

   if (isLoading) {
      return (
         <div className="container">
            <div>Loading...</div>
         </div>
      );
   }

   return (
      <div className='pageHome'>
         <div className="container">
            <ProductsList products={productsData} />
         </div>
      </div>
   );
};
