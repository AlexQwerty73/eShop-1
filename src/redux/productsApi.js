import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:3001/';
const typeTag = 'Products';
const resource = 'products';

export const productsApi = createApi({
   reducerPath: 'productApi',
   tagTypes: [typeTag],
   baseQuery: fetchBaseQuery({ baseUrl }),

   endpoints: (build) => ({
      getProducts: build.query({
         query: (id = '') => `${resource}/${id}`,
         providesTags: (result) =>
            result && Array.isArray(result)
               ? [
                  ...result.map(({ id }) => ({ type: typeTag, id })),
                  { type: typeTag, id: 'LIST' },
               ]
               : [{ type: typeTag, id: 'LIST' }],
      }),

      addProduct: build.mutation({
         query: (body) => ({
            url: resource,
            method: 'POST',
            body,
         }),
         invalidatesTags: [{ type: typeTag, id: 'LIST' }],
      }),

      updateProduct: build.mutation({
         query: ({ productId, body }) => ({
            url: `${resource}/${productId}`,
            method: 'PUT',
            body,
         }),
         invalidatesTags: (result, error, { productId }) => [
            { type: typeTag, id: productId },
            { type: typeTag, id: 'LIST' },
         ],
      }),

      deleteProduct: build.mutation({
         query: (id) => ({
            url: `${resource}/${id}`,
            method: 'DELETE',
         }),
         invalidatesTags: [{ type: typeTag, id: 'LIST' }],
      }),
   }),
});

export const {
   useGetProductsQuery,
   useAddProductMutation,
   useUpdateProductMutation,
   useDeleteProductMutation,
} = productsApi;
