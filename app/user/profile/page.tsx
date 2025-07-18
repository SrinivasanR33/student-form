'use client';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Snackbar,
  Paper
} from '@mui/material';
import { useGetUserFormQuery } from '@/lib/store/userApi';
import { useEffect, useState } from 'react';

export default function UserProfile() {
  const router = useRouter();
  const { data, isLoading, error } = useGetUserFormQuery(null,{refetchOnMountOrArgChange:true});
  const [snackbar, setSnackbar] = useState('');
 useEffect(() => {
    if (!data?.form?.submitted) router.push('/user/form');
  }, [data]);
  useEffect(() => {
    if (error) {
      setSnackbar('Failed to load user profile');
    }
  }, [error]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data?.form) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography>No form data found</Typography>
        <Button variant="contained" onClick={() => router.push('/user/form')}>
          Fill Form
        </Button>
      </Box>
    );
  }

  const { name, phoneNumber, email, degree, age, dateOfBirth, gender } = data.form;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
        <Box className={"flex justify-between items-center gap-2"}>

      <Typography variant="h6" className='pb-0'>
        User Profile
      </Typography>
       <Button variant="contained" sx={{ mt: 2 }} onClick={() => router.push('/user/form')}>
        Edit Profile
      </Button>
        </Box>
      <Paper sx={{ p: 3 }}>
        <Typography><strong>Name:</strong> {name}</Typography>
        <Typography><strong>Phone Number:</strong> {phoneNumber}</Typography>
        <Typography><strong>Email:</strong> {email}</Typography>
        <Typography><strong>Degree:</strong> {degree}</Typography>
        <Typography><strong>Age:</strong> {age}</Typography>
        {/* <Typography><strong>Date of Birth:</strong> {dateOfBirth}</Typography>
        <Typography><strong>Gender:</strong> {gender}</Typography> */}
      </Paper>

     

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar('')}
        message={snackbar}
      />
    </Box>
  );
}
