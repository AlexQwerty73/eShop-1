import React from 'react';
import s from './footer.module.css';
import { ColumnsData } from './ColumnsData';
import { Link } from 'react-router-dom';
import { Img } from '../../../common';
import { useAuth } from '../../../../context/AuthContext';

export const Footer = () => {
   const { userId } = useAuth();

   return (
      <div className={s.footer}>
         <div className="container">
            <div className={s.footer__header} />
            <div className={s.footer__main}>
               <div className={s.links}>
                  <ColumnsData />
               </div>

               {!userId && (
                  <div className={s.login}>
                     <Link to='/singup'>
                        <div className={s.img}>
                           <Img folder='myart' img='create-account.webp' />
                        </div>
                        <button className={s.loginButton}>
                           Create new account
                        </button>
                     </Link>
                  </div>
               )}
            </div>
            <div className={s.footer__footer}>
               <p>&copy; {new Date().getFullYear()} eShop. All rights reserved.</p>
            </div>
         </div>
      </div>
   );
};
