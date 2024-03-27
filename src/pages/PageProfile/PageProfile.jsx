import React from 'react';
import s from './pageProfile.module.css';
import { useParams } from 'react-router-dom';
import { useGetUsersQuery } from '../../redux';
import { UserProfile } from '../../components';

export const PageProfile = () => {
   const { userId } = useParams();
   const { data: user, isLoading, error } = useGetUsersQuery(userId);

   if (isLoading) {
      return (
         <div className={s.pageProfile}>
            <div className="container">
               <p>Loading...</p>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className={s.pageProfile}>
            <div className="container">
               <p>Error: {error.message}</p>
            </div>
         </div>
      );
   }

   if (!user) {
      return (
         <div className={s.pageProfile}>
            <div className="container">
               <p>User not found.</p>
            </div>
         </div>
      );
   }

   return (
      <div className={s.pageProfile}>
         <div className="container">
            <UserProfile user={user} />
         </div>
      </div>
   );
};
