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
  tagTypes: ['UserForm'], // 🔹 Declare tag types here
  endpoints: (builder) => ({
    getUserForm: builder.query({
      query: () => 'user/form',
      providesTags: ['UserForm'], // ✅ Provides the 'UserForm' tag
    }),
    submitUserForm: builder.mutation({
      query: (formData) => ({
        url: 'user/form',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['UserForm'], // ✅ Invalidates the tag to refresh 'getUserForm'
    }),
  }),
});

export const { useGetUserFormQuery, useSubmitUserFormMutation } = userApi;
