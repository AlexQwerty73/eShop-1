
import styles from '.././formComponent.module.css';

export const Address = ({ register, errors }) => {
   const name = 'address';

   return (
      <div className={styles.input_container}>
         <label>
            <div className={styles.title}>Address:</div>
            <input
               placeholder='123 Main St, City'
               type="text"
               {...register(name, {
                  required: 'Address is required'
               })}
            />
         </label>
         {errors[name] && <p>{errors[name].message}</p>}
      </div>
   );
};