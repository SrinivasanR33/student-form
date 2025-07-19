// components/AppBarComponent.tsx
'use client';

import { useAppDispatch, useAppSelector } from '@/lib/store/hook';
import { clearAuth } from '@/lib/store/authSlice';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import { useGetUserFormQuery } from '@/lib/store/userApi';

export default function AppBarComponent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const name = user?.name || user?.phoneNumber || 'User';
  const initials = name?.charAt(0).toUpperCase();
  const { data, isLoading, error } = useGetUserFormQuery(null,{refetchOnMountOrArgChange:true});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(clearAuth());
    router.push('/login');
  };

  const handleRedirect = () => {
    if(data?.form?.submitted){

        router.push('/user/profile');
    }else{

        router.push('/user/form');
    }
    handleMenuClose()
  };

  return (
    <AppBar position="static" color="default" elevation={1} className="bg-gray-300">
      <Toolbar className="flex justify-between">
        <Typography variant="h6" onClick={()=>{
            router.push('/')
        }} fontWeight="bold" className='cursor-pointer' color="inherit">
          Student Form
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleMenuOpen}>
            <Avatar>{initials}</Avatar>
          </IconButton>
          <Typography variant="body1">{name}</Typography>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
            <MenuItem onClick={handleRedirect}>Profile</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
