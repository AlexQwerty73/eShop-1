import React from 'react';
import s from './skeleton.module.css';

export const SkeletonCard = () => (
   <div className={s.card}>
      <div className={`${s.block} ${s.img}`} />
      <div className={`${s.block} ${s.name}`} />
      <div className={`${s.block} ${s.price}`} />
      <div className={`${s.block} ${s.stars}`} />
   </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
   <div className={s.grid}>
      {Array.from({ length: count }).map((_, i) => (
         <SkeletonCard key={i} />
      ))}
   </div>
);
