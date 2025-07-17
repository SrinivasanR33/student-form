'use client';
import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useVerifyOtpMutation } from '@/lib/store/authApi';
import { useRouter } from 'next/navigation';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [verifyOtp] = useVerifyOtpMutation();
        const router = useRouter();
  const phone = typeof window !== 'undefined' ? localStorage.getItem('phone') : '';

  const handleVerify = async () => {
    const res = await verifyOtp({ phoneNumber: phone, otp }).unwrap();
    if (res.success) {
      alert('OTP Verified!');
      router.push('/');
    } else {
      alert(res.message || 'Verification failed');
    }
  };

  return (
    <Box className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow space-y-4">
      <Typography variant="h5">Verify OTP</Typography>
      <TextField fullWidth label="OTP" onChange={(e) => setOtp(e.target.value)} />
      <Button fullWidth variant="contained" onClick={handleVerify}>Verify</Button>
    </Box>
  );
}
