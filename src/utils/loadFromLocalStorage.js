export const loadFromLocalStorage = key => {
   try {
     const data = localStorage.getItem(key);
     return data ? JSON.parse(data) : null;
   } catch (error) {
     console.error('Error loading from localStorage:', error);
     return null;
   }
 };