import React from 'react';
import { Img, Logo } from '../../../common';
import s from './header.module.css';
import { Link, NavLink } from 'react-router-dom';
import { loadFromLocalStorage } from '../../../../utils';

export const Header = () => {

   const loggedinUser = loadFromLocalStorage('userId');

   const links = [
      { path: '/', text: "Home" },
      { path: '/profile', text: "Profile" },
   ]

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
                           loggedinUser || ''
                              ? <Link to='/login'><Img folder='log' img='in.png' /></Link>
                              : <Img folder='log' img='out.png' link='#' />
                        }
                     </div>
                  </li>
               </ul>

            </nav>
         </div>
      </header>
   );
};