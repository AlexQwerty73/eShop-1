import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import s from './img.module.css';

const getImgSrc = (folder, img) => {
   if (!img) return `/imgs/products/not-found.png`;
   if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) {
      return img;
   }
   return `/imgs/${folder}/${img}`;
};

export const Img = ({ folder = '', img = '', link = '', alt = '', className = '' }) => {
   const src = getImgSrc(folder, img);
   const [loaded, setLoaded] = useState(false);

   const IMG = (
      <img
         className={`${s.img} ${className} ${loaded ? s.loaded : s.loading}`}
         src={src}
         alt={alt}
         loading="lazy"
         onLoad={() => setLoaded(true)}
         onError={(e) => { e.target.src = '/imgs/products/not-found.png'; setLoaded(true); }}
      />
   );

   if (link !== '') {
      return <Link to={link}>{IMG}</Link>;
   }

   return IMG;
};
