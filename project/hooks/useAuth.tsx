'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import * as api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper untuk mapping user Supabase ke user app
function mapUser(supabaseUser: any) {
  if (!supabaseUser) return null;
  return {
    ...supabaseUser,
    role: supabaseUser.user_metadata?.role || supabaseUser.role,
    name: supabaseUser.user_metadata?.nama || supabaseUser.name || supabaseUser.email,
    region: supabaseUser.user_metadata?.wilayah || supabaseUser.region,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Ambil user dari localStorage saat inisialisasi
  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(mapUser(parsed));
      setLoading(false);
    } else {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const res = await api.getMe();
          const mapped = mapUser(res?.user);
          setUser(mapped);
          if (mapped) localStorage.setItem('user', JSON.stringify(mapped));
        } catch {
          setUser(null);
          localStorage.removeItem('user');
        }
        setLoading(false);
      };
      fetchUser();
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await api.login(email, password);
    const mapped = mapUser(res.user);
    setUser(mapped);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(mapped));
    }
    // Redirect ke dashboard sesuai role
    const role = mapped.role;
    if (role === 'gapoktan') {
      router.push('/gapoktan/dashboard');
    } else if (role === 'penyuluh') {
      router.push('/penyuluh/dashboard');
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const register = async (data: any) => {
    setLoading(true);
    await api.register(data);
    setLoading(false);
    router.push('/login');
  };

  const logout = async () => {
    setLoading(true);
    await api.logout();
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    router.push('/login');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}