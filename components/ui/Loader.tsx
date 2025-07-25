'use client';

import CircularProgress from '@mui/material/CircularProgress';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-60">
      <CircularProgress size={60} thickness={5} />
    </div>
  );
}
