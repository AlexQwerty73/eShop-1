import React from 'react';
import { FormComponent } from '../../components/common';
import s from './login.module.css';
import { useGetUsersQuery } from '../../redux';
import { useNavigate } from 'react-router-dom';
import { saveToLocalStorage } from '../../utils';

export const PageLogin = () => {
   const navigate = useNavigate();
   const { data: usersData = [] } = useGetUsersQuery();
   console.log(usersData);

   const onSubmit = (data) => {


      console.log(data.email, usersData);

      const user = usersData?.find(user => user.email === data.email);
      const isPasswordCorrect = user?.password === data.password;

      console.log(user, isPasswordCorrect);
      if (isPasswordCorrect) {
         saveToLocalStorage('user', user.id);
         navigate(-1);
      } else {
         console.log('Wrong password or email');
      }
   };

   return (
      <div>
         <div className="container">
            <div className={s.form}>
               <FormComponent
                  inputs={['email', 'password']}
                  onSubmit={onSubmit}
               />
            </div>
         </div>
      </div>
   );
};