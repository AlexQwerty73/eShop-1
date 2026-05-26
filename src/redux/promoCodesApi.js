import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:3001/';
const typeTag = 'PromoCodes';
const resource = 'promoCodes';

export const promoCodesApi = createApi({
   reducerPath: 'promoCodesApi',
   tagTypes: [typeTag],
   baseQuery: fetchBaseQuery({ baseUrl }),

   endpoints: (build) => ({
      getPromoCodes: build.query({
         query: () => resource,
         providesTags: [{ type: typeTag, id: 'LIST' }],
      }),

      updatePromoCode: build.mutation({
         query: (body) => ({
            url: `${resource}/${body.id}`,
            method: 'PUT',
            body,
         }),
         invalidatesTags: [{ type: typeTag, id: 'LIST' }],
      }),
   }),
});

export const { useGetPromoCodesQuery, useUpdatePromoCodeMutation } = promoCodesApi;
