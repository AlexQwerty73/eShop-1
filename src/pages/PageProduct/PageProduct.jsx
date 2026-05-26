import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../../redux';
import s from './pageProduct.module.css';
import { ProductDetails, ProductNotFound, ProductsList } from '../../components';
import { Breadcrumbs } from '../../components/common/Breadcrumbs/Breadcrumbs';
import { usePageTitle, useRecentlyViewed } from '../../hooks';

export const PageProduct = () => {
   const { productId } = useParams();
   const { data: product, isLoading, error } = useGetProductsQuery(productId);
   const { data: allProducts = [] } = useGetProductsQuery();
   const { recentIds } = useRecentlyViewed(productId);

   usePageTitle(product?.name || 'Product');

   if (error) {
      return (
         <div className="container">
            <ProductNotFound />
         </div>
      );
   }

   if (!product || isLoading) {
      return (
         <div className="container">
            <div>Loading...</div>
         </div>
      );
   }

   const breadcrumbs = [
      { label: 'Home', to: '/' },
      ...(product.category?.[0] ? [{ label: product.category[0] }] : []),
      { label: product.name },
   ];

   const recentProducts = recentIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter(Boolean)
      .slice(0, 4);

   return (
      <div className={s.pageProduct}>
         <div className="container">
            <Breadcrumbs items={breadcrumbs} />
            <ProductDetails product={product} />

            {recentProducts.length > 0 && (
               <div className={s.recentSection}>
                  <h2 className={s.recentTitle}>🕐 Recently Viewed</h2>
                  <ProductsList products={recentProducts} />
               </div>
            )}
         </div>
      </div>
   );
};
