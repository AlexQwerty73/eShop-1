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
         providesTags: (result) => [
            ...(result || []).map(({ id }) => ({ type: typeTag, id })),
            { type: typeTag, id: 'LIST' },
         ],
      }),

   }),
});

export const { useGetUsersQuery } = usersApi;
