import React, { useState } from 'react';
import { FormComponent } from '../../components/common';
import s from './login.module.css';
import { useGetUsersQuery } from '../../redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { usePageTitle } from '../../hooks';

export const PageLogin = () => {
   usePageTitle('Sign In');
   const navigate = useNavigate();
   const { data: usersData = [] } = useGetUsersQuery();
   const { login } = useAuth();
   const [loginError, setLoginError] = useState('');

   const onSubmit = (data) => {
      const user = usersData?.find((u) => u.email === data.email);
      const isPasswordCorrect = user?.password === data.password;

      if (isPasswordCorrect) {
         login(user.id);
         navigate(-1);
      } else {
         setLoginError('Wrong email or password. Please try again.');
      }
   };

   return (
      <div className={s.page}>

         {/* ── Left decorative panel ── */}
         <aside className={s.panel}>
            <div className={s.panelIcon}>🛍️</div>
            <h1 className={s.panelTitle}>Welcome back!</h1>
            <p className={s.panelSub}>
               Sign in to access your orders, wishlist and exclusive deals.
            </p>
            <ul className={s.panelFeatures}>
               <li><span>📦</span><span>Track your orders in real time</span></li>
               <li><span>❤️</span><span>Save items to your wishlist</span></li>
               <li><span>🏷️</span><span>Get personalised offers</span></li>
               <li><span>🔐</span><span>Secure & private checkout</span></li>
            </ul>
         </aside>

         {/* ── Right form panel ── */}
         <div className={s.formSide}>
            <div className={s.formCard}>
               <div className={s.formHeader}>
                  <h2 className={s.formTitle}>Sign In</h2>
                  <p className={s.formSubtitle}>Enter your credentials to continue</p>
               </div>

               <FormComponent
                  inputs={['email', 'password']}
                  onSubmit={onSubmit}
                  submitLabel="Sign In →"
               />

               {loginError && (
                  <p className={s.error}>
                     <span>⚠️</span> {loginError}
                  </p>
               )}

               <p className={s.bottomText}>
                  Don't have an account?
                  <Link to="/singup">Create one</Link>
               </p>
            </div>
         </div>

      </div>
   );
};
