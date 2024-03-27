export const averageRating = (product) => {
   return product.reviews ? (product.reviews.reduce((a, b) => a + Number(b.stars), 0) / product.reviews.length) : 0;

}