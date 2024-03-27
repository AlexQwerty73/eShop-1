
import styles from '.././formComponent.module.css';

export const First_name = ({ register, errors }) => {
   const name = 'last_name';

   return (
      <div className={styles.input_container}>
         <label>
            <div className={styles.title}>Name:</div>
            <input
            placeholder='first name'
               type="text"
               {...register(name, {
                  required: 'Name is required'
               })}
            />
         </label>
         {errors[name] && <p>{errors[name].message}</p>}
      </div>
   );
};