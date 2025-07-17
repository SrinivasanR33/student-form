// lib/store/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface SignupPayload {
  name: string;
  email: string;
  phoneNumber: string;
}

interface LoginPayload {
  phoneNumber: string;
}

interface OtpPayload {
  phoneNumber: string;
}

interface VerifyOtpPayload {
  phoneNumber: string | null;
  otp: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/auth/' }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data: SignupPayload) => ({
        url: 'signup',
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data: LoginPayload) => ({
        url: 'login',
        method: 'POST',
        body: data,
      }),
    }),
    sendOtp: builder.mutation({
      query: (data: OtpPayload) => ({
        url: 'send-otp',
        method: 'POST',
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data: VerifyOtpPayload) => ({
        url: 'verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = authApi;
