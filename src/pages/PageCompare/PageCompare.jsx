import React from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../redux';
import { useCompare } from '../../context/CompareContext';
import { Img, RenderStars } from '../../components/common';
import { averageRating, priceWithDiscount } from '../../utils';
import { usePageTitle } from '../../hooks';
import s from './pageCompare.module.css';

const ROWS = [
   { label: 'Image',       key: 'image' },
   { label: 'Name',        key: 'name' },
   { label: 'Price',       key: 'price' },
   { label: 'Rating',      key: 'rating' },
   { label: 'Category',    key: 'category' },
   { label: 'Description', key: 'description' },
   { label: 'Inventory',   key: 'inventory' },
   { label: 'Discount',    key: 'discount' },
   { label: 'Variants',    key: 'variants' },
];

export const PageCompare = () => {
   usePageTitle('Compare Products');
   const { compareIds, removeFromCompare, clearCompare } = useCompare();
   const { data: allProducts = [] } = useGetProductsQuery();

   const products = compareIds.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);

   const renderCell = (product, key) => {
      switch (key) {
         case 'image':
            return (
               <div className={s.imgCell}>
                  <Img folder="products" img={product.imgs?.[0]} alt={product.name} />
               </div>
            );
         case 'name':
            return <Link to={`/product/${product.id}`} className={s.nameLink}>{product.name}</Link>;
         case 'price':
            return product.discount > 0
               ? <><span className={s.strike}>{product.price} {product.currency}</span> <strong style={{ color: 'tomato' }}>{priceWithDiscount(product)} {product.currency}</strong></>
               : <strong>{product.price} {product.currency}</strong>;
         case 'rating':
            return <><RenderStars rating={averageRating(product)} /> {averageRating(product)}</>;
         case 'category':
            return (product.category || []).join(', ') || '—';
         case 'description':
            return <span className={s.desc}>{product.description || '—'}</span>;
         case 'inventory':
            return product.inventory > 0
               ? <span className={s.inStock}>{product.inventory} in stock</span>
               : <span className={s.outStock}>Out of stock</span>;
         case 'discount':
            return product.discount > 0
               ? <span className={s.discount}>-{(product.discount * 100).toFixed(0)}%</span>
               : '—';
         case 'variants':
            return (product.variants || []).length > 0
               ? (product.variants || []).join(', ')
               : '—';
         default:
            return '—';
      }
   };

   if (compareIds.length === 0) {
      return (
         <div className="container">
            <h1 className={s.title}>Compare Products</h1>
            <p className={s.empty}>No products selected for comparison. <Link to="/">Browse products</Link> and click ⚖ to add them here.</p>
         </div>
      );
   }

   return (
      <div className="container">
         <div className={s.topBar}>
            <h1 className={s.title}>Compare Products ({products.length})</h1>
            <button className={s.clearBtn} onClick={clearCompare}>✕ Clear All</button>
         </div>

         <div className={s.tableWrapper}>
            <table className={s.table}>
               <thead>
                  <tr>
                     <th className={s.rowHeader}>Feature</th>
                     {products.map((p) => (
                        <th key={p.id} className={s.colHeader}>
                           <button className={s.removeBtn} onClick={() => removeFromCompare(p.id)} title="Remove">✕</button>
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {ROWS.map((row) => (
                     <tr key={row.key} className={s.row}>
                        <td className={s.rowLabel}>{row.label}</td>
                        {products.map((p) => (
                           <td key={p.id} className={s.cell}>
                              {renderCell(p, row.key)}
                           </td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};
