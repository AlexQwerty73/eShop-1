import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FormComponent } from '../../components/common';
import s from './pageAuth.module.css';
import { useGetUsersQuery, useAddUserMutation } from '../../redux';
import { useAuth } from '../../context';
import { usePageTitle } from '../../hooks';

export const PageAuth = () => {
   const location  = useLocation();
   const navigate  = useNavigate();
   const { login } = useAuth();

   // Derive initial mode from URL
   const initialMode = location.pathname.includes('singup') ? 'signup' : 'login';
   const [mode, setMode] = useState(initialMode);

   // Sync mode when browser navigates (back/forward)
   useEffect(() => {
      setMode(location.pathname.includes('singup') ? 'signup' : 'login');
   }, [location.pathname]);

   usePageTitle(mode === 'login' ? 'Sign In' : 'Create Account');

   const { data: usersData = [] } = useGetUsersQuery();
   const [addNewUser] = useAddUserMutation();

   const [loginError,  setLoginError]  = useState('');
   const [signupError, setSignupError] = useState('');

   const goSignup = () => {
      setLoginError('');
      setMode('signup');
      navigate('/singup/', { replace: true });
   };

   const goLogin = () => {
      setSignupError('');
      setMode('login');
      navigate('/login/', { replace: true });
   };

   /* ── Login submit ── */
   const onLoginSubmit = (data) => {
      const user = usersData?.find((u) => u.email === data.email);
      if (user?.password === data.password) {
         login(user.id);
         navigate('/');
      } else {
         setLoginError('Wrong email or password. Please try again.');
      }
   };

   /* ── Signup submit ── */
   const onSignupSubmit = async (data) => {
      setSignupError('');
      const { confirm_password, ...userData } = data;

      const emailExists = usersData.some(
         (u) => u.email?.toLowerCase() === userData.email?.toLowerCase()
      );
      if (emailExists) {
         setSignupError('This email is already registered. Sign in instead.');
         return;
      }

      try {
         const created = await addNewUser({
            ...userData,
            published_products: [],
            orders: [],
            avatar: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
         }).unwrap();
         login(created.id);
         navigate('/');
      } catch {
         setSignupError('Registration failed. Please try again.');
      }
   };

   const isSignup = mode === 'signup';

   return (
      <div className={s.page}>
         <div className={s.container}>

            {/* ── Left: Login form ── */}
            <div className={`${s.loginSide} ${!isSignup ? s.loginVisible : ''}`}>
               <div className={s.formInner}>
                  <h2 className={s.formTitle}>Sign In</h2>
                  <p className={s.formSubtitle}>Welcome back — we missed you!</p>
                  <FormComponent
                     inputs={['email', 'password']}
                     onSubmit={onLoginSubmit}
                     submitLabel="Sign In →"
                  />
                  {loginError && (
                     <div className={s.errorBanner}>⚠️ {loginError}</div>
                  )}
               </div>
            </div>

            {/* ── Right: Signup form ── */}
            <div className={`${s.signupSide} ${isSignup ? s.signupVisible : ''}`}>
               <div className={s.formInner}>
                  <h2 className={s.formTitle}>Create Account</h2>
                  <p className={s.formSubtitle}>Free forever · No hidden fees</p>
                  <FormComponent
                     inputs={['first_name', 'last_name', 'email', 'password', 'confirm_password', 'address']}
                     onSubmit={onSignupSubmit}
                     submitLabel="Create Account →"
                  />
                  {signupError && (
                     <div className={s.errorBanner}>⚠️ {signupError}</div>
                  )}
               </div>
            </div>

            {/* ── Sliding decorative panel ── */}
            {/*
               Login mode:  panel at left:50% translateX(0)   → covers right (signup)
               Signup mode: panel at left:50% translateX(-100%) → covers left (login)
            */}
            <div className={`${s.panel} ${isSignup ? s.panelLeft : ''}`}>

               {/* Face A — shown when panel is on the RIGHT (login mode) → promote login */}
               <div className={`${s.face} ${!isSignup ? s.faceVisible : ''}`}>
                  <span className={s.panelIcon}>🛍️</span>
                  <h3 className={s.panelTitle}>Welcome back!</h3>
                  <p className={s.panelText}>
                     Already have an account? Sign in to pick up right where you left off.
                  </p>
                  <ul className={s.panelList}>
                     <li><span>🔐</span><span>Secure & private checkout</span></li>
                     <li><span>🚚</span><span>Lightning-fast checkout</span></li>
                     <li><span>⭐</span><span>Access all your reviews</span></li>
                  </ul>
                  <button className={s.panelBtn} onClick={goSignup}>
                     Create Account →
                  </button>
               </div>

               {/* Face B — shown when panel is on the LEFT (signup mode) → promote signup */}
               <div className={`${s.face} ${isSignup ? s.faceVisible : ''}`}>
                  <span className={s.panelIcon}>✨</span>
                  <h3 className={s.panelTitle}>New here?</h3>
                  <p className={s.panelText}>
                     Join thousands of happy shoppers and start discovering great deals today.
                  </p>
                  <ul className={s.panelList}>
                     <li><span>📦</span><span>Track your orders in real time</span></li>
                     <li><span>❤️</span><span>Save items to your wishlist</span></li>
                     <li><span>🏷️</span><span>Exclusive member discounts</span></li>
                  </ul>
                  <button className={s.panelBtn} onClick={goLogin}>
                     ← Sign In
                  </button>
               </div>

            </div>

         </div>
      </div>
   );
};
