import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('access_token') : null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserForm: builder.query({
      query: () => 'user/form',
    }),
    submitUserForm: builder.mutation({
      query: (formData) => ({
        url: 'user/form',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useGetUserFormQuery, useSubmitUserFormMutation } = userApi;
