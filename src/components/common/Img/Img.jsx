import React from 'react';
import { Link } from 'react-router-dom';
import s from './img.module.css';

export const Img = ({ folder = "", img = "", link = "", alt = "" }) => {

   const IMG = <img className={s.img} src={`imgs/${folder}/${img}`} alt={alt} />;

   if (link !== "") {
      return (
         <Link to={ link }>
            { IMG }
         </Link>
      );
   }

   return  IMG 
};
