import React from 'react';
import styles from '.././formComponent.module.css';

export const Currency = ({ register, errors }) => {
  const name = 'currency';

  return (
    <div className={styles.input_container}>
      <label>
        <div  className={styles.title}>Currency:</div>
        <select {...register(name, { required: 'Please select a currency.' })}>
          <option value="">Select currency</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">UAH</option>
        </select>
      </label>
      {errors[name] && <p>{errors[name].message}</p>}
    </div>
  );
};
