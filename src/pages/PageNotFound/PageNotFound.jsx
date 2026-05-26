import React from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../../hooks';
import s from './pageNotFound.module.css';

export const PageNotFound = () => {
   usePageTitle('404 — Page Not Found');

   return (
      <div className={s.page}>
         <div className="container">
            <div className={s.content}>
               <div className={s.code}>404</div>
               <h1 className={s.title}>Page Not Found</h1>
               <p className={s.subtitle}>The page you're looking for doesn't exist or has been moved.</p>
               <Link to="/" className={s.homeBtn}>← Back to Home</Link>
            </div>
         </div>
      </div>
   );
};
