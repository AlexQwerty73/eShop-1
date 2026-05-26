import React, { useState } from 'react';
import { FormComponent } from '../../components/common';
import s from './singin.module.css';
import { useAddUserMutation, useGetUsersQuery } from '../../redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { usePageTitle } from '../../hooks';

export const PageSingup = () => {
   usePageTitle('Create Account');
   const navigate = useNavigate();
   const [addNewUser] = useAddUserMutation();
   const { login } = useAuth();
   const [error, setError] = useState('');

   const { data: allUsers = [] } = useGetUsersQuery();

   const onSubmit = async (data) => {
      setError('');
      const { confirm_password, ...userData } = data;

      const emailExists = allUsers.some(
         (u) => u.email?.toLowerCase() === userData.email?.toLowerCase()
      );
      if (emailExists) {
         setError('An account with this email already exists. Please use a different email or log in.');
         return;
      }

      const newUserData = {
         ...userData,
         published_products: [],
         orders: [],
         avatar: null,
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
      };

      try {
         const createdUser = await addNewUser(newUserData).unwrap();
         login(createdUser.id);
         navigate('/');
      } catch (err) {
         setError('Registration failed. Please try again.');
         console.error('Error creating user:', err);
      }
   };

   return (
      <div className={s.page}>

         {/* ── Left decorative panel ── */}
         <aside className={s.panel}>
            <div className={s.panelIcon}>✨</div>
            <h1 className={s.panelTitle}>Join our community</h1>
            <p className={s.panelSub}>
               Create a free account and start shopping smarter today.
            </p>
            <ol className={s.steps}>
               <li>
                  <span className={s.stepNum}>1</span>
                  <span>Fill in your details below</span>
               </li>
               <li>
                  <span className={s.stepNum}>2</span>
                  <span>Confirm your account</span>
               </li>
               <li>
                  <span className={s.stepNum}>3</span>
                  <span>Start shopping & saving</span>
               </li>
               <li>
                  <span className={s.stepNum}>4</span>
                  <span>List your own products</span>
               </li>
            </ol>
         </aside>

         {/* ── Right form panel ── */}
         <div className={s.formSide}>
            <div className={s.formCard}>
               <div className={s.formHeader}>
                  <h2 className={s.formTitle}>Create Account</h2>
                  <p className={s.formSubtitle}>Free forever · No hidden fees</p>
               </div>

               <FormComponent
                  inputs={['first_name', 'last_name', 'email', 'password', 'confirm_password', 'address']}
                  onSubmit={onSubmit}
                  submitLabel="Create Account →"
               />

               {error && (
                  <p className={s.error}>
                     <span>⚠️</span> {error}
                  </p>
               )}

               <p className={s.terms}>
                  By creating an account you agree to our Terms of Service and Privacy Policy.
               </p>

               <p className={s.bottomText}>
                  Already have an account?
                  <Link to="/login">Sign in</Link>
               </p>
            </div>
         </div>

      </div>
   );
};
