
import styles from '.././formComponent.module.css';

export const Password = ({ register, errors }) => {
   const name = 'password';
 
   return (
     <div className={styles.input_container}>
       <label>
         <div className={styles.title}>Password:</div>
         <input
         placeholder='************'
           type="password"
           {...register(name, {
             required: 'Password is required',
             minLength: {
               value: 8,
               message: 'Password must be at least 8 characters long'
             }
           })}
         />
       </label>
       {errors[name] && <p>{errors[name].message}</p>}
     </div>
   );
 };