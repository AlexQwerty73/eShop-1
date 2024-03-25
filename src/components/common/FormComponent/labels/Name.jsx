
import styles from '.././formComponent.module.css';

export const Name = ({ register, errors }) => {
   const name = 'name';

   return (
      <div className={styles.input_container}>
         <label>
            <div className={styles.title}>Name:</div>
            <input
            placeholder='your name'
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