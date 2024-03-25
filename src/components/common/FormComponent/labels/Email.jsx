
import styles from '.././formComponent.module.css';

export const Email = ({ register, errors }) => {
   const name = 'email';
 
   return (
     <div className={styles.input_container}>
       <label>
         <div className={styles.title}>Email:</div>
         <input
         placeholder='email@gmail.com'
           type="email"
           {...register(name, {
             required: 'Email is required',
             pattern: {
               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
               message: 'Please enter a valid email address'
             }
           })}
         />
       </label>
       {errors[name] && <p>{errors[name].message}</p>}
     </div>
   );
 };
 