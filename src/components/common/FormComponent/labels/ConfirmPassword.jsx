import styles from '.././formComponent.module.css';

export const ConfirmPassword = ({ register, errors, watch }) => {
   const name = 'confirm_password';

   return (
      <div className={styles.input_container}>
         <label>
            <div className={styles.title}>Confirm Password:</div>
            <input
               placeholder="Repeat password"
               type="password"
               {...register(name, {
                  required: 'Please confirm your password',
                  validate: (value) =>
                     value === watch('password') || 'Passwords do not match',
               })}
            />
         </label>
         {errors[name] && <p className={styles.error}>{errors[name].message}</p>}
      </div>
   );
};
