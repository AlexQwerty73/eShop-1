import React from 'react';
import s from './pageProfile.module.css';
import { useParams, Navigate } from 'react-router-dom';
import { useGetUsersQuery } from '../../redux';
import { UserProfile } from '../../components';
import { useAuth } from '../../context';
import { usePageTitle } from '../../hooks';

export const PageProfile = () => {
   const { userId: paramId } = useParams();
   const { userId: authId } = useAuth();

   // Only allow viewing your own profile
   if (paramId !== authId) {
      return <Navigate to={`/profile/${authId}`} replace />;
   }

   return <PageProfileContent userId={authId} />;
};

const PageProfileContent = ({ userId }) => {
   const { data: user, isLoading, error } = useGetUsersQuery(userId);
   usePageTitle(user ? `${user.first_name} ${user.last_name}` : 'Profile');

   if (isLoading) {
      return (
         <div className={s.pageProfile}>
            <div className="container"><p>Loading...</p></div>
         </div>
      );
   }

   if (error || !user) {
      return (
         <div className={s.pageProfile}>
            <div className="container"><p>User not found.</p></div>
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
