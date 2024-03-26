import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:3001/';
const typeTag = 'Users';
const resource = 'users';

export const usersApi = createApi({
   reducerPath: 'usersApi',
   tagTypes: [typeTag],
   baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),

   endpoints: (build) => ({
      getUsers: build.query({
         query: (id = '') => `${resource}/${id}`,
         providesTags: (result) =>
            result && Array.isArray(result)
               ? [
                  ...result.map(({ id }) => ({ type: typeTag, id })),
                  { type: typeTag, id: 'LIST' },
               ]
               : [{ type: typeTag, id: 'LIST' }],
      }),

      addUser: build.mutation({
         query: (body) => ({
            url: resource,
            method: 'POST',
            body,
         }),
         invalidatesTags: [{ type: typeTag, id: 'LIST' }],
      }),
   }),
});

export const { useGetUsersQuery, useAddUserMutation } = usersApi;