'use client';
import { useState } from 'react';
import { TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useSignupMutation, useVerifyOtpMutation } from '@/lib/store/authApi';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import AuthRedirect from '@/components/Authroute/AuthRedirect';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', otp: '' });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' as 'success' | 'error' | 'info' });

  const router = useRouter();
  const [signup] = useSignupMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await signup(form).unwrap();
      if (res.success) {
        setStep(2);
        setFeedback({ open: true, message: res.message || 'OTP sent!', severity: 'success' });
      }
    } catch (err: unknown) {
  let errorMessage = 'Something went wrong';
  
  if (err && typeof err === 'object' && 'data' in err) {
    const errorData = (err as FetchBaseQueryError).data as { message?: string };
    errorMessage = errorData?.message || errorMessage;
  }

  setFeedback({ open: true, message: errorMessage, severity: 'error' });
}finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await verifyOtp({ phoneNumber: form.phoneNumber, otp: form.otp }).unwrap();
      if (res.success) {
        setFeedback({ open: true, message: 'OTP Verified!', severity: 'success' });
        router.push('/login');
      } else {
        setFeedback({ open: true, message: 'Invalid OTP', severity: 'error' });
      }
    } catch (err: unknown) {
  let errorMessage = 'Something went wrong';
  
  if (err && typeof err === 'object' && 'data' in err) {
    const errorData = (err as FetchBaseQueryError).data as { message?: string };
    errorMessage = errorData?.message || errorMessage;
  }

  setFeedback({ open: true, message: errorMessage, severity: 'error' });
} finally {
      setLoading(false);
    }
  };

  return (
    <AuthRedirect>
    <>
      {loading && <Loader />}
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10 }} className="bg-white p-6 rounded-sm">
        <Typography variant="h5" className="text-black font-bold">Signup</Typography>
        {step === 1 ? (
          <>
            <TextField name="name" label="Name" value={form.name} fullWidth margin="normal" onChange={handleChange} />
            <TextField name="email" label="Email" fullWidth  value={form.email} margin="normal" onChange={handleChange} />
            <TextField name="phoneNumber" label="Phone Number" value={form.phoneNumber} fullWidth margin="normal" onChange={handleChange} />
             <Typography variant="body2" className="text-black" align="right" sx={{ mt: 1 }}>
           {" Already have a account?"}{" "}
            <Button variant="text" onClick={() => router.push("/login")}>
              Login
            </Button>
          </Typography>
            <Button onClick={handleSignup} variant="contained" fullWidth>Signup & Send OTP</Button>
          </>
        ) : (
          <>
            <TextField name="otp" label="Enter OTP" value={form.otp} fullWidth margin="normal" onChange={handleChange} />
            <Button onClick={handleVerify} variant="contained" fullWidth>Verify OTP</Button>
          </>
        )}
      </Box>

      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={feedback.severity} onClose={() => setFeedback({ ...feedback, open: false })}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
    </AuthRedirect>
  );
}
