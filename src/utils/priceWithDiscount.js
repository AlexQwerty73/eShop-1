export const priceWithDiscount = (product) => {
   return (product.price - product.price * product.discount).toFixed(2);
}