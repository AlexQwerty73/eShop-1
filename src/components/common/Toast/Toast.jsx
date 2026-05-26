import React from 'react';
import { useToast } from '../../../context';
import s from './toast.module.css';

export const ToastContainer = () => {
   const { toasts, removeToast } = useToast();

   if (!toasts.length) return null;

   return (
      <div className={s.container}>
         {toasts.map((toast) => (
            <div
               key={toast.id}
               className={`${s.toast} ${s[toast.type] || s.info}`}
               onClick={() => removeToast(toast.id)}
            >
               <span className={s.icon}>
                  {toast.type === 'success' && '✓'}
                  {toast.type === 'error' && '✕'}
                  {toast.type === 'warning' && '⚠'}
                  {toast.type === 'info' && 'ℹ'}
               </span>
               <span className={s.message}>{toast.message}</span>
               <button className={s.close} onClick={() => removeToast(toast.id)}>×</button>
            </div>
         ))}
      </div>
   );
};
