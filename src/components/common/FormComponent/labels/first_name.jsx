import styles from '.././formComponent.module.css';

export const FirstName = ({ register, errors }) => {
   const name = 'first_name';

   return (
      <div className={styles.input_container}>
         <label>
            <div className={styles.title}>First Name:</div>
            <input
               placeholder="First name"
               type="text"
               {...register(name, { required: 'First name is required' })}
            />
         </label>
         {errors[name] && <p className={styles.error}>{errors[name].message}</p>}
      </div>
   );
};

// Keep old name for backward compatibility
export const First_name = FirstName;
