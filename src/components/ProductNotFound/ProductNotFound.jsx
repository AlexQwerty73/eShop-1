import React from 'react';
import s from './productNotFound.module.css';
import { useNavigate } from 'react-router-dom';

export const ProductNotFound = () => {
   const navigate = useNavigate();

   return (
      <div>
         <h1 className={s.text}>Product not found <span className={s.goback} onClick={() => navigate(-1)}>Go Back</span></h1>
      </div>
   );
};