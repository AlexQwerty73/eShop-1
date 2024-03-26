import React from 'react';
import s from './renderStars.module.css';

const RenderStars = ({ rating }) => {
   const fullStars = 5;
   let a = Math.round(rating);

   return (
      <div className={s.rating}>
         {[...Array(fullStars)].map((_, index) => {
            if (a < 1) {
               return <span key={index} className={s.star}>&#9734;</span>;
            } else {
               a--;
               return <span key={index} className={s.star}>&#9733;</span>;
            }
         })}
      </div>
   );
};

export default RenderStars;
