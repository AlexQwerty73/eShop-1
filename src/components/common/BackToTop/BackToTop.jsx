import React, { useState, useEffect } from 'react';
import s from './backToTop.module.css';

export const BackToTop = () => {
   const [visible, setVisible] = useState(false);

   useEffect(() => {
      const handleScroll = () => setVisible(window.scrollY > 320);
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

   return (
      <button
         className={`${s.btn} ${visible ? s.visible : ''}`}
         onClick={scrollToTop}
         aria-label="Back to top"
         title="Back to top"
      >
         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
         </svg>
      </button>
   );
};
