"use client";

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PenyuluhDashboard } from '@/components/dashboard/PenyuluhDashboard';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const role = (user as any)?.user_metadata?.role || user?.role;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (role !== 'penyuluh') {
        if (role === 'gapoktan') router.push('/gapoktan/dashboard');
        else if (role === 'admin') router.push('/dashboard');
      }
    }
  }, [user, loading, router, role]);

  if (loading || !user || role !== 'penyuluh') return null;

  return (
    <DashboardLayout>
      <PenyuluhDashboard />
    </DashboardLayout>
  );
} 