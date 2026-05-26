import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './formComponent.module.css';
import {
   Currency, Number, FirstName, LastName,
   Email, Password, Phone, Address, ConfirmPassword,
} from './labels';

export const FormComponent = ({ inputs, onSubmit, submitLabel = 'Submit' }) => {
   const { register, handleSubmit, watch, formState: { errors } } = useForm();

   return (
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
         {inputs.map((input) => {
            switch (input) {
               case 'currency':
                  return <Currency key={input} register={register} errors={errors} />;
               case 'number':
                  return <Number key={input} register={register} errors={errors} />;
               case 'name':
               case 'first_name':
                  return <FirstName key={input} register={register} errors={errors} />;
               case 'surname':
               case 'last_name':
                  return <LastName key={input} register={register} errors={errors} />;
               case 'email':
                  return <Email key={input} register={register} errors={errors} />;
               case 'password':
                  return <Password key={input} register={register} errors={errors} />;
               case 'confirm_password':
                  return <ConfirmPassword key={input} register={register} errors={errors} watch={watch} />;
               case 'phone':
                  return <Phone key={input} register={register} errors={errors} />;
               case 'address':
                  return <Address key={input} register={register} errors={errors} />;
               default:
                  return null;
            }
         })}
         <button className={styles.button} type="submit">{submitLabel}</button>
      </form>
   );
};
