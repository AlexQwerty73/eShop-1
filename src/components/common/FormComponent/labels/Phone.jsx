
import styles from '.././formComponent.module.css';

export const Phone = ({ register, errors }) => {
   const name = 'phone';

   return (
      <div className={styles.input_container}>
         <label>
            <div className={styles.title}>Phone:</div>
            <input
            placeholder='0000000000'
               type="tel"
               {...register(name, {
                  required: 'Phone number is required',
                  pattern: {
                     value: /^\d{10}$/,
                     message: 'Please enter a valid phone number'
                  }
               })}
            />
         </label>
         {errors[name] && <p>{errors[name].message}</p>}
      </div>
   );
};