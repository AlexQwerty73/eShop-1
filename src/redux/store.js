import { configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./productsApi";
import { usersApi } from "./usersApi";

export const store = configureStore({
   reducer: {
      [productsApi.reducerPath]: productsApi.reducer,
      [usersApi.reducerPath]: usersApi.reducer,
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware, usersApi.middleware)
});
