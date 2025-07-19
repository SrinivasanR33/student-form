'use client'
import { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useGetUserFormQuery, useSubmitUserFormMutation } from '@/lib/store/userApi';
import Loader from '@/components/ui/Loader';
import SnackbarAlert from '@/components/ui/SnackbarAlert';

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
  const [snackbar, setSnackbar] = useState({message:"",type:"info" as "success" | "error" | "info"});
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data, isLoading, error } = useGetUserFormQuery(null,{refetchOnMountOrArgChange:true});
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
     setLoading(true);
    try {
      await submitForm(form).unwrap();
       setSnackbar({message:'Form Successfully Saved',type:'success'});
        setTimeout(() => {
           setLoading(false);
            if(!data?.form?.submitted){
        router.push("/");
      }else{
        router.back();
      }
        }, 1000);
    
    } catch (err) {
      setSnackbar({message:'Failed to save form',type:'error'});
    }
  };

  return (
    <Box sx={{ maxWidth: 600,width:"100%", mx: 'auto', mt: 5 ,p:3}}>
       {loading && <Loader />}
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
      <Box className="flex w-[100%] justify-center pt-2">

      <Button variant="contained"  onClick={handleSubmit} disabled={submitting}>
        {submitting ? <CircularProgress size={24} /> : 'Save'}
      </Button>
      </Box>
      <SnackbarAlert
        open={!!snackbar.message}
        onClose={() => setSnackbar({message:'',type:"info" as "success" | "error" | "info"})}
        message={snackbar?.message}
        severity={snackbar?.type}
      />
    </Box>
  );
}
