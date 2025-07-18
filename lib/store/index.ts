import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './authApi';
import authReducer from './authSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userApi } from './userApi';

export const store = configureStore({
  reducer: { 
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer
   },
  middleware: (gDM) => gDM().concat(authApi.middleware,userApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;