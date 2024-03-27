
import styles from '.././formComponent.module.css';

export const Last_name = ({ register, errors }) => {
   const name = 'last_name';

   return (
      <div className={styles.input_container}>
         <label>
            <div className={styles.title}>Surname:</div>
            <input
            placeholder='last name'
               type="text"
               {...register(name, {
                  required: 'last name is required'
               })}
            />
         </label>
         {errors[name] && <p>{errors[name].message}</p>}
      </div>
   );
};