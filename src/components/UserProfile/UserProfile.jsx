import React, { useState } from 'react';
import s from './profile.module.css';
import { formatDateTime } from '../../utils';
import { useUpdateUserMutation } from '../../redux';

export const UserProfile = ({ user }) => {
   const [updateUser] = useUpdateUserMutation();
   const [editedUser, setEditedUser] = useState({ ...user });
   const [isEditing, setIsEditing] = useState(false);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedUser({ ...editedUser, [name]: value });
   };

   const handleSave = async () => {
      try {
         await updateUser(editedUser).unwrap();
         setIsEditing(false);
      } catch (error) {
         console.error('Помилка під час збереження:', error);
      }
   };

   return (
      <div className={s.profile}>
         <h2 className={s.title}>Profile</h2>
         <div className={s.info}>
            <div className={s.item}>
               <strong className={s.label}>Name:</strong>
               {isEditing ? (
                  <>
                     <input
                        type="text"
                        name="first_name"
                        value={editedUser.first_name}
                        onChange={handleChange}
                        className={s.input}
                        placeholder="First Name"
                     />
                     <input
                        type="text"
                        name="last_name"
                        value={editedUser.last_name}
                        onChange={handleChange}
                        className={s.input}
                        placeholder="Last Name"
                     />
                  </>
               ) : (
                  <span className={s.value}>{editedUser.first_name} {editedUser.last_name}</span>
               )}
            </div>
            <div className={s.item}>
               <strong className={s.label}>Email:</strong>
               {isEditing ? (
                  <input
                     type="email"
                     name="email"
                     value={editedUser.email}
                     onChange={handleChange}
                     className={s.input}
                     placeholder="Email"
                  />
               ) : (
                  <span className={s.value}>{editedUser.email}</span>
               )}
            </div>
            <div className={s.item}>
               <strong className={s.label}>Address:</strong>
               {isEditing ? (
                  <input
                     type="text"
                     name="address"
                     value={editedUser.address}
                     onChange={handleChange}
                     className={s.input}
                     placeholder="Address"
                  />
               ) : (
                  <span className={s.value}>{editedUser.address}</span>
               )}
            </div>
            {!isEditing && (
               <div className={s.item}>
                  <strong className={s.label}>Last Updated:</strong>
                  <span className={s.value}>{formatDateTime(user.updated_at)}</span>
               </div>
            )}
            {!isEditing && (
               <div className={s.item}>
                  <strong className={s.label}>Created At:</strong>
                  <span className={s.value}>{formatDateTime(user.created_at)}</span>
               </div>
            )}
         </div>
         {isEditing ? (
            <button className={`${s.saveButton} ${s.btn}`} onClick={handleSave}>Save</button>
         ) : (
            <button className={`${s.editButton} ${s.btn}`} onClick={() => setIsEditing(true)}>Edit</button>
         )}
      </div>
   );
};
