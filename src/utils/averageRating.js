export const averageRating = (product) => {
   if (!product.reviews || product.reviews.length === 0) return 0;
   const sum = product.reviews.reduce((a, b) => a + Number(b.stars), 0);
   return parseFloat((sum / product.reviews.length).toFixed(2));
}