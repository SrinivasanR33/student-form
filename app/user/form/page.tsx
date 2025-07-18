'use client'
import { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useGetUserFormQuery, useSubmitUserFormMutation } from '@/lib/store/userApi';

export default function UserForm() {
  const [form, setForm] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    degree: '',
    age: '',
    // dateOfBirth: '',
    // gender: ''
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>({});
  const [snackbar, setSnackbar] = useState('');
  const router = useRouter();

  const { data, isLoading, error } = useGetUserFormQuery(null);
  const [submitForm, { isLoading: submitting }] = useSubmitUserFormMutation();

  useEffect(() => {
     if (data?.form) setForm({
  name: data?.form?.name,
  phoneNumber: data?.form?.phoneNumber,
  email: data?.form?.email,
  degree: data?.form?.degree,
  age: data?.form?.age,
});
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors:any = {};
    Object.entries(form).forEach(([key, val]) => {
      if (!val) newErrors[key] = `${key} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await submitForm(form).unwrap();
      router.push('/user/profile');
    } catch (err) {
      setSnackbar('Failed to save form');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Typography variant="h6">User Form</Typography>
      {Object.keys(form).map((field) => (
        <TextField
          key={field}
          name={field}
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          fullWidth
          margin="normal"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value={(form as any)[field] || ''}
          onChange={handleChange}
          error={!!errors[field]}
          disabled={['name', 'phoneNumber', 'email'].includes(field)}
          helperText={errors[field] || ''}
        />
      ))}
      <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
        {submitting ? <CircularProgress size={24} /> : 'Save'}
      </Button>
      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar('')}
        message={snackbar}
      />
    </Box>
  );
}
