export const saveToLocalStorage = (key, value) => {
   try {
     localStorage.setItem(key, JSON.stringify(value));
   } catch (error) {
     console.error('Error saving to localStorage:', error);
   }
 };