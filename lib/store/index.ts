import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './authApi';
import authReducer from './authSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: { auth: authReducer,[authApi.reducerPath]: authApi.reducer },
  middleware: (gDM) => gDM().concat(authApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;