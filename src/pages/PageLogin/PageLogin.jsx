import React from 'react';
import { FormComponent } from '../../components/common';
import s from './login.module.css';

export const PageLogin = () => {

   const onSubmit = (data) => {
      console.log(data);
   }

   return (
      <div>

         <div className="container">

            <div className={s.form}>
               <FormComponent
                  inputs={['name', 'email', 'password', 'address']}
                  onSubmit={onSubmit}
               />
            </div>
         </div>

      </div>
   );
};