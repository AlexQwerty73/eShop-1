import React, { useState, useRef } from 'react';
import s from './profile.module.css';
import { formatDateTime } from '../../utils';
import { useUpdateUserMutation, useDeleteUserMutation } from '../../redux';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const UserProfile = ({ user }) => {
   const [updateUser] = useUpdateUserMutation();
   const [deleteUser] = useDeleteUserMutation();
   const { showToast } = useToast();
   const { logout } = useAuth();
   const navigate = useNavigate();
   const [editedUser, setEditedUser] = useState({ ...user });
   const [isEditing, setIsEditing] = useState(false);

   // Password change
   const [showPwdForm, setShowPwdForm] = useState(false);
   const [oldPassword, setOldPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [pwdError, setPwdError] = useState('');

   // Delete account
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [deleting, setDeleting] = useState(false);

   // Avatar
   const avatarInputRef = useRef(null);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedUser({ ...editedUser, [name]: value });
   };

   const handleSave = async () => {
      try {
         await updateUser({ ...editedUser, updated_at: new Date().toISOString() }).unwrap();
         setIsEditing(false);
         showToast('Profile updated!', 'success');
      } catch (error) {
         showToast('Failed to save profile', 'error');
         console.error('Error saving profile:', error);
      }
   };

   const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
         const avatar = ev.target.result;
         try {
            await updateUser({ ...user, avatar, updated_at: new Date().toISOString() }).unwrap();
            setEditedUser((prev) => ({ ...prev, avatar }));
            showToast('Avatar updated!', 'success');
         } catch {
            showToast('Failed to update avatar', 'error');
         }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
   };

   const handleDeleteAccount = async () => {
      setDeleting(true);
      try {
         await deleteUser(user.id).unwrap();
         showToast('Account deleted', 'info');
         logout();
         navigate('/');
      } catch {
         showToast('Failed to delete account', 'error');
         setDeleting(false);
         setShowDeleteConfirm(false);
      }
   };

   const handlePasswordChange = async () => {
      setPwdError('');
      if (!oldPassword || !newPassword || !confirmPassword) {
         setPwdError('All fields are required.');
         return;
      }
      if (oldPassword !== user.password) {
         setPwdError('Current password is incorrect.');
         return;
      }
      if (newPassword.length < 8) {
         setPwdError('New password must be at least 8 characters.');
         return;
      }
      if (newPassword !== confirmPassword) {
         setPwdError('Passwords do not match.');
         return;
      }
      try {
         await updateUser({ ...user, password: newPassword, updated_at: new Date().toISOString() }).unwrap();
         setOldPassword('');
         setNewPassword('');
         setConfirmPassword('');
         setShowPwdForm(false);
         showToast('Password changed successfully!', 'success');
      } catch {
         showToast('Failed to change password', 'error');
      }
   };

   return (
      <div className={s.profile}>
         <h2 className={s.title}>Profile</h2>

         {/* Avatar section */}
         <div className={s.avatarSection}>
            <div className={s.avatarCircle} onClick={() => avatarInputRef.current.click()} title="Click to change avatar">
               {editedUser.avatar ? (
                  <img src={editedUser.avatar} alt="avatar" className={s.avatarImg} />
               ) : (
                  <span className={s.avatarInitials}>
                     {(editedUser.first_name?.[0] || '').toUpperCase()}
                     {(editedUser.last_name?.[0] || '').toUpperCase()}
                  </span>
               )}
               <div className={s.avatarOverlay}>📷</div>
            </div>
            <input
               ref={avatarInputRef}
               type="file"
               accept="image/*"
               style={{ display: 'none' }}
               onChange={handleAvatarChange}
            />
         </div>

         <div className={s.info}>
            <div className={s.item}>
               <strong className={s.label}>Name:</strong>
               {isEditing ? (
                  <>
                     <input type="text" name="first_name" value={editedUser.first_name} onChange={handleChange} className={s.input} placeholder="First Name" />
                     <input type="text" name="last_name"  value={editedUser.last_name}  onChange={handleChange} className={s.input} placeholder="Last Name" />
                  </>
               ) : (
                  <span className={s.value}>{editedUser.first_name} {editedUser.last_name}</span>
               )}
            </div>
            <div className={s.item}>
               <strong className={s.label}>Email:</strong>
               {isEditing ? (
                  <input type="email" name="email" value={editedUser.email} onChange={handleChange} className={s.input} placeholder="Email" />
               ) : (
                  <span className={s.value}>{editedUser.email}</span>
               )}
            </div>
            <div className={s.item}>
               <strong className={s.label}>Address:</strong>
               {isEditing ? (
                  <input type="text" name="address" value={editedUser.address} onChange={handleChange} className={s.input} placeholder="Address" />
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

         {/* Password change section */}
         <div className={s.pwdSection}>
            <button className={s.pwdToggleBtn} onClick={() => { setShowPwdForm((v) => !v); setPwdError(''); }}>
               {showPwdForm ? 'Cancel' : '🔒 Change Password'}
            </button>

            {showPwdForm && (
               <div className={s.pwdForm}>
                  <input type="password" placeholder="Current password"       value={oldPassword}     onChange={(e) => setOldPassword(e.target.value)}     className={s.input} />
                  <input type="password" placeholder="New password (min 8)"   value={newPassword}     onChange={(e) => setNewPassword(e.target.value)}     className={s.input} />
                  <input type="password" placeholder="Confirm new password"   value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={s.input} />
                  {pwdError && <div className={s.pwdError}>{pwdError}</div>}
                  <button className={`${s.saveButton} ${s.btn}`} onClick={handlePasswordChange}>Update Password</button>
               </div>
            )}
         </div>

         {/* Danger zone — Delete account */}
         <div className={s.dangerSection}>
            <p className={s.dangerTitle}>⚠️ Danger Zone</p>
            {!showDeleteConfirm ? (
               <button className={s.deleteAccountBtn} onClick={() => setShowDeleteConfirm(true)}>
                  🗑 Delete My Account
               </button>
            ) : (
               <div className={s.deleteConfirmBox}>
                  <p className={s.deleteConfirmText}>
                     Are you sure? This will permanently delete your account, orders and all data. This cannot be undone.
                  </p>
                  <div className={s.deleteConfirmActions}>
                     <button className={s.deleteConfirmYes} onClick={handleDeleteAccount} disabled={deleting}>
                        {deleting ? 'Deleting...' : 'Yes, delete'}
                     </button>
                     <button className={s.deleteConfirmNo} onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};
