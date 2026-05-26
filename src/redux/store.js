import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./productsApi";
import { usersApi } from "./usersApi";
import { promoCodesApi } from "./promoCodesApi";

export const store = configureStore({
   reducer: {
      [productsApi.reducerPath]: productsApi.reducer,
      [usersApi.reducerPath]: usersApi.reducer,
      [promoCodesApi.reducerPath]: promoCodesApi.reducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
         productsApi.middleware,
         usersApi.middleware,
         promoCodesApi.middleware
      ),
});
