import React from 'react';
import s from './footer.module.css';
import { ColumnsData } from './ColumnsData';
import { Link } from 'react-router-dom';
import { Img } from '../../../common';

export const Footer = () => {

   return (
      <div className={s.footer}>
         <div className="container">
            <div className={s.footer__header}>

            </div>
            <div className={s.footer__main}>
               <div className={s.links}>

                  <ColumnsData />

               </div>

               <div className={s.login}>
                  <Link to='/singin'>
                     <div className={s.img}>
                        <Img folder='myart' img='create-account.webp' />
                     </div>
                     <button className={s.loginButton}>
                        Create new  account
                     </button>
                  </Link>
               </div>

            </div>
            <div className={s.footer__footer}>
               <p>&copy; 2024 My Website. All rights reserved.</p>
            </div>
         </div>
      </div >
   );
};