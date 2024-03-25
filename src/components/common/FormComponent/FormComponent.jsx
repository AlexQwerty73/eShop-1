import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './formComponent.module.css';
import { Currency, Number, Name, Surname, Email, Password, Phone, PIN, CardCategory, CardType, Address, Amount, UserCards } from './labels';

export const FormComponent = ({ inputs, onSubmit }) => {
   const { register, handleSubmit, formState: { errors } } = useForm();

   return (
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
         {inputs.map((input) => {
            switch (input) {
               case 'currency':
                  return <Currency key={input} register={register} errors={errors} required />;
               case 'number':
                  return <Number key={input} register={register} errors={errors} required />;
               case 'name':
                  return <Name key={input} register={register} errors={errors} required />;
               case 'surname':
                  return <Surname key={input} register={register} errors={errors} required />;
               case 'email':
                  return <Email key={input} register={register} errors={errors} required />;
               case 'password':
                  return <Password key={input} register={register} errors={errors} required />;
               case 'phone':
                  return <Phone key={input} register={register} errors={errors} required />;
               case 'address':
                  return <Address key={input} register={register} errors={errors} required />;
               default:
                  return null;
            }
         })}
         <button className={styles.button} type="submit">Submit</button>
      </form>
   );
};
