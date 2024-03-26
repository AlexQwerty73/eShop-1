export const formatDateTime = (inputDateString) => {
   const date = new Date(inputDateString);

   const timeString = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
   const dateString = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

   return `${timeString} - ${dateString}`;
}