'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      router.replace('/'); // redirect to home if already logged in
    }
  }, []);

  return <>{children}</>;
}
