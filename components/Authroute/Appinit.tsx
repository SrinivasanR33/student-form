'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/lib/store/authSlice';
import { jwtDecode } from 'jwt-decode';
import AppBarComponent from '../Appbar/AppbarComponent';

export default function AppInit() {
  const dispatch = useDispatch();

  const token = sessionStorage.getItem('access_token');
  const userStr = sessionStorage.getItem('user');
  useEffect(() => {

    if (token && userStr) {
      try {
        const decoded = jwtDecode(token) 
        dispatch(setAuth({ token, user: decoded }));
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }, []);

  return token && userStr?<AppBarComponent/>: null; // No UI needed
}
