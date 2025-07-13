'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
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
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-earth-green-700 mb-2">HarvestSun</h1>
          <p className="text-earth-brown-600 mb-8">Digital Agriculture Management Platform</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full bg-earth-green-600 hover:bg-earth-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}