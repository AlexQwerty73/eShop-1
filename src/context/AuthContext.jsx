import { createContext, useContext, useState, useCallback } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
   const [userId, setUserId] = useState(() => loadFromLocalStorage('user'));

   const login = useCallback((id) => {
      saveToLocalStorage('user', id);
      setUserId(id);
   }, []);

   const logout = useCallback(() => {
      localStorage.removeItem('user');
      setUserId(null);
   }, []);

   const isAdmin = userId === 'admin';

   return (
      <AuthContext.Provider value={{ userId, login, logout, isAdmin }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);
