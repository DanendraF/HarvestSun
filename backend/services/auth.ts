import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Register user (penyuluh/gapoktan)
export async function registerUser({
  email,
  password,
  nama,
  role,
  no_hp,
  wilayah,
  alamat
}: {
  email: string;
  password: string;
  nama: string;
  role: 'penyuluh' | 'gapoktan';
  no_hp: string;
  wilayah: string;
  alamat?: string;
}) {
  // 1. Register ke Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nama, role, no_hp, wilayah, alamat }
    }
  });
  if (error || !data.user) return { error: error || new Error('User not created') };
  // 2. Hash password dan insert ke tabel profiles
  const hash = await bcrypt.hash(password, 10);
  await supabase.from('profiles').insert([{
    id: data.user.id,
    nama,
    email, // tambahkan email
    role,
    no_hp,
    wilayah,
    alamat,
    password: hash
  }]);
  return { user: data.user };
}

// Register banyak user sekaligus
export async function registerManyUser(users: Array<{
  email: string;
  password: string;
  nama: string;
  role: 'penyuluh' | 'gapoktan';
  no_hp?: string;
  wilayah: string;
  alamat?: string;
}>) {
  const results = [];
  for (const user of users) {
    try {
      // Register ke Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: { nama: user.nama, role: user.role, no_hp: user.no_hp, wilayah: user.wilayah, alamat: user.alamat }
        }
      });
      if (error || !data.user) {
        results.push({ email: user.email, success: false, error: error?.message || 'User not created' });
        continue;
      }
      // Hash password dan insert ke tabel profiles
      const hash = await bcrypt.hash(user.password, 10);
      await supabase.from('profiles').insert([{
        id: data.user.id,
        nama: user.nama,
        email: user.email, // tambahkan email
        role: user.role,
        no_hp: user.no_hp,
        wilayah: user.wilayah,
        alamat: user.alamat,
        password: hash
      }]);
      results.push({ email: user.email, success: true });
    } catch (err: any) {
      results.push({ email: user.email, success: false, error: err.message });
    }
  }
  return { results };
}

// Login user
export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

// Get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Get profile
export async function getProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return { data, error };
}

// Logout user
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  return { error };
} 
