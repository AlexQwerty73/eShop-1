import React from 'react';
import styles from '.././formComponent.module.css';

export const Number = ({ register, errors }) => {
  const name = 'number';

  return (
    <div className={styles.input_container}>
      <label>
        <div className={styles.title}>Card Number:</div>
        <input
          placeholder='0000 0000 0000 0000'
          type="text"
          {...register(name, {
            required: 'Card number is required',
            pattern: {
              value: /^[0-9]{16}$/,
              message: 'Please enter a valid 16-digit card number'
            }
          })}
        />
      </label>
      {errors[name] && <p>{errors[name].message}</p>}
    </div>
  );
};
