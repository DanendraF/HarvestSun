'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GapoktanDashboard } from '@/components/dashboard/GapoktanDashboard';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const role = (user as any)?.user_metadata?.role || user?.role;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (role !== 'gapoktan') {
        if (role === 'penyuluh') router.push('/penyuluh/dashboard');
        else if (role === 'admin') router.push('/dashboard');
      }
    }
  }, [user, loading, router, role]);

  if (loading || !user || role !== 'gapoktan') return null;

  return (
    <DashboardLayout>
      <GapoktanDashboard />
    </DashboardLayout>
  );
}