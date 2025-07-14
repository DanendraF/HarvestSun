'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      // Redirect berdasarkan role user
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'gapoktan') {
        router.push('/gapoktan/dashboard');
      } else if (user.role === 'penyuluh') {
        router.push('/penyuluh/dashboard');
      } else {
        // Default ke gapoktan jika role tidak dikenali
        router.push('/gapoktan/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-earth-green-50 to-earth-brown-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-green-50 to-earth-brown-50 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
} 