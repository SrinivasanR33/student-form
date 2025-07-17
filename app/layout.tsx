'use client';

import './globals.css';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/lib/theme';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import AppInit from '@/components/Authroute/Appinit';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem('user');

    const isAuthRoute = pathname === '/login' || pathname === '/signup';

    if (!user && !isAuthRoute) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  if (loading) {
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center min-h-screen text-gray-600 text-lg">
            Loading...
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <AppInit/>
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
