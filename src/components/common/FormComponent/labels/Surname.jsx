
import styles from '.././formComponent.module.css';

export const Surname = ({ register, errors }) => {
   const name = 'surname';

   return (
      <div className={styles.input_container}>
         <label>
            <div className={styles.title}>Surname:</div>
            <input
            placeholder='ypur surname'
               type="text"
               {...register(name, {
                  required: 'Surname is required'
               })}
            />
         </label>
         {errors[name] && <p>{errors[name].message}</p>}
      </div>
   );
};