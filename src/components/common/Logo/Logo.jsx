import React from 'react';
import s from './logo.module.css';
import { Img } from '../';

export const Logo = () => {
   return (
      <div className={s.logo}>
         <Img folder='logo' img='main.png' alt='Logo' link='/'/>
      </div>
   );
};
