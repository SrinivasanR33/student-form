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

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const name = user?.name || user?.phoneNumber || 'User';
  const initials = name?.charAt(0).toUpperCase();

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

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar className="flex justify-between">
          <Typography variant="h6" fontWeight="bold" color="inherit">
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
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <main className="flex flex-col items-center justify-center min-h-[80vh]">
        <Typography variant="h4" className="mt-10">
          Welcome to the Student Form Page 🎓
        </Typography>
      </main>
    </>
  );
}
