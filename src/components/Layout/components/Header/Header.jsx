import React, { useState } from 'react';
import { Img, Logo } from '../../../common';
import s from './header.module.css';
import { Link, NavLink } from 'react-router-dom';
import { loadFromLocalStorage } from '../../../../utils';

export const Header = () => {
   const [loggedinUser, setLoggedinUser] = useState(loadFromLocalStorage('user'));
   console.log(loggedinUser);

   const links = [
      { path: '/', text: "Home" },
      { path: '/profile', text: "Profile" },
   ]

   const logOutFromStorage = () => {
      localStorage.removeItem('user');
      setLoggedinUser(null);
   }

   return (
      <header className={s.header}>
         <div className="container">
            <nav className={s.nav}>

               <Logo />

               <ul className={s.navList}>
                  {
                     links.map((link, index) => (
                        <li key={index}><NavLink to={link.path}>{link.text}</NavLink></li>
                     ))
                  }
                  <li>
                     <div className={s.logImg}>
                        {
                           <Img folder='cart' img='cart.png' link='cart' alt='cart img' />
                        }
                     </div>
                  </li>
                  <li>
                     <div className={s.logImg}>
                        {
                           loggedinUser || ''
                              ? <div onClick={logOutFromStorage}> <Img folder='log' img='out.png' /></div>
                              : <Link to='/login'><Img folder='log' img='in.png' /></Link>
                        }
                     </div>
                  </li>
               </ul>

            </nav>
         </div>
      </header>
   );
};