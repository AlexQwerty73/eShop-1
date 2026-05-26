import styles from '.././formComponent.module.css';

export const LastName = ({ register, errors }) => {
   const name = 'last_name';

   return (
      <div className={styles.input_container}>
         <label>
            <div className={styles.title}>Last Name:</div>
            <input
               placeholder="Last name"
               type="text"
               {...register(name, { required: 'Last name is required' })}
            />
         </label>
         {errors[name] && <p className={styles.error}>{errors[name].message}</p>}
      </div>
   );
};

// Keep old name for backward compatibility
export const Last_name = LastName;
