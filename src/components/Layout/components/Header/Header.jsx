import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { useCart } from '../../../../context/CartContext';
import { useCompare } from '../../../../context/CompareContext';
import { useGetUsersQuery } from '../../../../redux';
import s from './header.module.css';

export const Header = () => {
   const { userId, logout, isAdmin } = useAuth();
   const { cartCount } = useCart();
   const { compareIds } = useCompare();
   const navigate = useNavigate();

   const { data: userData } = useGetUsersQuery(userId, { skip: !userId });

   const [mobileOpen, setMobileOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [userMenuOpen, setUserMenuOpen] = useState(false);

   const userMenuRef = useRef(null);

   // Close user dropdown on outside click
   useEffect(() => {
      const handle = (e) => {
         if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
            setUserMenuOpen(false);
         }
      };
      document.addEventListener('mousedown', handle);
      return () => document.removeEventListener('mousedown', handle);
   }, []);

   // Close mobile menu on resize to desktop
   useEffect(() => {
      const handle = () => { if (window.innerWidth > 768) setMobileOpen(false); };
      window.addEventListener('resize', handle);
      return () => window.removeEventListener('resize', handle);
   }, []);

   const handleSearch = (e) => {
      e.preventDefault();
      const q = searchQuery.trim();
      if (q) {
         navigate(`/?q=${encodeURIComponent(q)}`);
         setSearchQuery('');
         setMobileOpen(false);
      }
   };

   const renderAvatar = () => {
      if (userData?.avatar) {
         return <img src={userData.avatar} alt="avatar" className={s.avatarImg} />;
      }
      const initials = userData
         ? `${(userData.first_name || '')[0] || ''}${(userData.last_name || '')[0] || ''}`.toUpperCase()
         : '?';
      return <div className={s.avatarInitials}>{initials}</div>;
   };

   const accountLinks = [
      { icon: '👤', text: 'My Profile',   path: `/profile/${userId}` },
      { icon: '📦', text: 'My Orders',    path: '/orders/' },
      { icon: '⭐', text: 'My Reviews',   path: '/my-reviews/' },
      { icon: '🏪', text: 'My Products',  path: '/my-products/' },
      { icon: '➕', text: 'Sell Product', path: '/sell/' },
   ];
   if (isAdmin) {
      accountLinks.push({ icon: '🔧', text: 'Admin Panel', path: '/admin/' });
      accountLinks.push({ icon: '📊', text: 'Dashboard',   path: '/admin/dashboard/' });
   }

   const closeMobile = () => setMobileOpen(false);
   const closeUser   = () => setUserMenuOpen(false);

   return (
      <header className={s.header}>
         <div className="container">
            <div className={s.inner}>

               {/* ── LEFT: Logo ── */}
               <Link to="/" className={s.logoLink} aria-label="Home">
                  <img src="/imgs/logo/main.png" alt="eShop" className={s.logoImg} />
               </Link>

               {/* ── CENTER: Search ── */}
               <form className={s.searchForm} onSubmit={handleSearch}>
                  <input
                     className={s.searchInput}
                     type="text"
                     placeholder="Search products..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     aria-label="Search"
                  />
                  <button type="submit" className={s.searchBtn} aria-label="Search">
                     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                     </svg>
                  </button>
               </form>

               {/* ── RIGHT: Icons + User ── */}
               <div className={s.actions}>

                  {/* Wishlist */}
                  <NavLink to="/wishlist/" className={({ isActive }) => `${s.iconBtn} ${isActive ? s.iconActive : ''}`} title="Wishlist">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                     </svg>
                  </NavLink>

                  {/* Compare */}
                  <NavLink to="/compare/" className={({ isActive }) => `${s.iconBtn} ${s.hasBadge} ${isActive ? s.iconActive : ''}`} title="Compare">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                     </svg>
                     {compareIds.length > 0 && <span className={`${s.badge} ${s.badgeBlue}`}>{compareIds.length}</span>}
                  </NavLink>

                  {/* Cart */}
                  <NavLink to="/cart/" className={({ isActive }) => `${s.iconBtn} ${s.hasBadge} ${isActive ? s.iconActive : ''}`} title="Cart">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                     </svg>
                     {cartCount > 0 && <span className={`${s.badge} ${s.badgeRed}`}>{cartCount > 99 ? '99+' : cartCount}</span>}
                  </NavLink>

                  <span className={s.divider} />

                  {/* User section */}
                  {userId ? (
                     <div className={s.userMenuWrap} ref={userMenuRef}>
                        <button className={s.avatarBtn} onClick={() => setUserMenuOpen((v) => !v)} aria-label="Account">
                           <div className={s.avatarWrap}>{renderAvatar()}</div>
                           <span className={s.userName}>{userData?.first_name || 'Account'}</span>
                           <svg className={`${s.chevron} ${userMenuOpen ? s.chevronUp : ''}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9" />
                           </svg>
                        </button>

                        {userMenuOpen && (
                           <div className={s.dropdown}>
                              <div className={s.dropdownHeader}>
                                 <div className={s.dropdownAvatar}>{renderAvatar()}</div>
                                 <div className={s.dropdownUserInfo}>
                                    <div className={s.dropdownName}>{userData?.first_name} {userData?.last_name}</div>
                                    <div className={s.dropdownEmail}>{userData?.email}</div>
                                 </div>
                              </div>
                              <div className={s.dropdownDivider} />
                              {accountLinks.map((link) => (
                                 <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) => `${s.dropdownItem} ${isActive ? s.dropdownActive : ''}`}
                                    onClick={closeUser}
                                 >
                                    <span className={s.dropdownIcon}>{link.icon}</span>
                                    {link.text}
                                 </NavLink>
                              ))}
                              <div className={s.dropdownDivider} />
                              <button className={s.logoutBtn} onClick={() => { logout(); closeUser(); }}>
                                 <span className={s.dropdownIcon}>🚪</span>Log Out
                              </button>
                           </div>
                        )}
                     </div>
                  ) : (
                     <div className={s.authLinks}>
                        <Link to="/login"   className={s.loginBtn}>Log In</Link>
                        <Link to="/singup/" className={s.signupBtn}>Sign Up</Link>
                     </div>
                  )}
               </div>

               {/* Hamburger — mobile only */}
               <button
                  className={`${s.hamburger} ${mobileOpen ? s.hamburgerOpen : ''}`}
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label="Toggle menu"
               >
                  <span /><span /><span />
               </button>
            </div>
         </div>

         {/* ── Mobile drawer ── */}
         {mobileOpen && (
            <div className={s.mobileDrawer}>
               <div className="container">
                  <form className={s.mobileSearch} onSubmit={handleSearch}>
                     <input
                        className={s.searchInput}
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                     <button type="submit" className={s.searchBtn}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                           <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                     </button>
                  </form>

                  <nav className={s.mobileLinks}>
                     <NavLink to="/" end className={({ isActive }) => `${s.mobileLink} ${isActive ? s.mobileLinkActive : ''}`} onClick={closeMobile}>🏠 Home</NavLink>
                     <NavLink to="/wishlist/" className={({ isActive }) => `${s.mobileLink} ${isActive ? s.mobileLinkActive : ''}`} onClick={closeMobile}>♡ Wishlist</NavLink>
                     <NavLink to="/compare/" className={({ isActive }) => `${s.mobileLink} ${isActive ? s.mobileLinkActive : ''}`} onClick={closeMobile}>⚖ Compare {compareIds.length > 0 && `(${compareIds.length})`}</NavLink>
                     <NavLink to="/cart/" className={({ isActive }) => `${s.mobileLink} ${isActive ? s.mobileLinkActive : ''}`} onClick={closeMobile}>🛒 Cart {cartCount > 0 && `(${cartCount})`}</NavLink>

                     {userId ? (
                        <>
                           <div className={s.mobileDivider} />
                           <div className={s.mobileUser}>
                              <div className={s.mobileUserAvatar}>{renderAvatar()}</div>
                              <div>
                                 <div className={s.mobileUserName}>{userData?.first_name} {userData?.last_name}</div>
                                 <div className={s.mobileUserEmail}>{userData?.email}</div>
                              </div>
                           </div>
                           {accountLinks.map((link) => (
                              <NavLink key={link.path} to={link.path} className={({ isActive }) => `${s.mobileLink} ${isActive ? s.mobileLinkActive : ''}`} onClick={closeMobile}>
                                 {link.icon} {link.text}
                              </NavLink>
                           ))}
                           <div className={s.mobileDivider} />
                           <button className={s.mobileLogout} onClick={() => { logout(); closeMobile(); }}>🚪 Log Out</button>
                        </>
                     ) : (
                        <>
                           <div className={s.mobileDivider} />
                           <Link to="/login"   className={s.mobileLink} onClick={closeMobile}>→ Log In</Link>
                           <Link to="/singup/" className={s.mobileLink} onClick={closeMobile}>→ Sign Up</Link>
                        </>
                     )}
                  </nav>
               </div>
            </div>
         )}
      </header>
   );
};
