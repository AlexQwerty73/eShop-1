import React, { useState } from 'react';
import { Img, Logo } from '../../../common';
import s from './header.module.css';
import { Link, NavLink } from 'react-router-dom';
import { loadFromLocalStorage } from '../../../../utils';

export const Header = () => {
   const [loggedinUser, setLoggedinUser] = useState(loadFromLocalStorage('user'));
   const userId = loadFromLocalStorage('user');
   const [showSubMenu, setShowSubMenu] = useState(false);

   const links = [
      { path: '/', text: "Home" },
      {
         text: "Account",
         links: [
            { text: "Profile", path: `/profile/${userId}` },
            { text: "Orders", path: `/orders/` }
         ]
      },
   ];

   const logOutFromStorage = () => {
      localStorage.removeItem('user');
      setLoggedinUser(null);
   };

   const handleSubMenuToggle = () => {
      setShowSubMenu(!showSubMenu);
   };

   return (
      <header className={s.header}>
         <div className="container">
            <nav className={s.nav}>

               <Logo />

               <ul className={s.navList}>
                  {links.map((link, index) => (
                     <li key={index}>
                        {link.links ? (
                           <div className={s.subMenuTrigger} onMouseEnter={handleSubMenuToggle} onMouseLeave={handleSubMenuToggle}>
                              {link.text}
                              <span className={s.arrow}>&#9662;</span>
                              {showSubMenu && (
                                 <ul className={s.subMenu}>
                                    {link.links.map((subLink, subIndex) => (
                                       <li key={subIndex}>
                                          <NavLink to={subLink.path}>{subLink.text}</NavLink>
                                       </li>
                                    ))}
                                 </ul>
                              )}
                           </div>
                        ) : (
                           <NavLink to={link.path}>{link.text}</NavLink>
                        )}
                     </li>
                  ))}
                  <li>
                     <div className={s.logImg}>
                        <Img folder='cart' img='cart.png' link='cart' alt='cart img' />
                     </div>
                  </li>
                  <li>
                     <div className={s.logImg}>
                        {loggedinUser ? (
                           <div onClick={logOutFromStorage}>
                              <Img folder='log' img='out.png' />
                           </div>
                        ) : (
                           <Link to='/login'>
                              <Img folder='log' img='in.png' />
                           </Link>
                        )}
                     </div>
                  </li>
               </ul>

            </nav>
         </div>
      </header>
   );
};
