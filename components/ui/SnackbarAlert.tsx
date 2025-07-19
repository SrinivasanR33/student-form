// components/ui/SnackbarAlert.tsx
'use client';

import { Snackbar, Alert } from '@mui/material';
import React from 'react';

interface SnackbarAlertProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export default function SnackbarAlert({
  open,
  message,
  severity = 'info',
  onClose
}: SnackbarAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
