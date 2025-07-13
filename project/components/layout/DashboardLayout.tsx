'use client';

import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from './Sidebar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-earth-green-50 to-earth-brown-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-earth-green-50 to-earth-brown-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-earth-brown-800 mb-4">Access Denied</h2>
          <p className="text-earth-brown-600">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-green-50 to-earth-brown-50">
      <Sidebar />
      <main className="flex-1 overflow-auto ml-64">
        {children}
      </main>
    </div>
  );
}