import React from 'react';
import { Link } from 'react-router-dom';
import s from './breadcrumbs.module.css';

/**
 * items: [{ label: 'Home', to: '/' }, { label: 'Product Name' }]
 * Last item is always current page (no link).
 */
export const Breadcrumbs = ({ items = [] }) => {
   if (!items.length) return null;

   return (
      <nav className={s.nav} aria-label="Breadcrumb">
         <ol className={s.list}>
            {items.map((item, i) => {
               const isLast = i === items.length - 1;
               return (
                  <li key={i} className={s.item}>
                     {!isLast && item.to ? (
                        <>
                           <Link to={item.to} className={s.link}>{item.label}</Link>
                           <span className={s.sep} aria-hidden="true">›</span>
                        </>
                     ) : (
                        <span className={s.current} aria-current="page">{item.label}</span>
                     )}
                  </li>
               );
            })}
         </ol>
      </nav>
   );
};
