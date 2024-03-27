import React from 'react';
import { FormComponent } from '../../components/common';
import s from './singin.module.css';
import { useAddUserMutation } from '../../redux'
import { useNavigate } from 'react-router-dom';
import { saveToLocalStorage } from '../../utils';

export const PageSingup = () => {
   const navigate = useNavigate();
   const [addNewUser] = useAddUserMutation();

   const onSubmit = (data) => {
      const newUserData = {
         ...data,
         published_products: [],
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString()
      }
      
      addNewUser(newUserData);

      saveToLocalStorage('user', newUserData.id);

      navigate(-1);
   }

   return (
      <div>

         <div className="container">

            <div className={s.form}>
               <FormComponent
                  inputs={['name', 'surname', 'email', 'password', 'address']}
                  onSubmit={onSubmit}
               />
            </div>
         </div>

      </div>
   );
};