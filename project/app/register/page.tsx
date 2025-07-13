"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const wilayahList = [
  'Berbah', 'Cangkringan', 'Depok', 'Gamping', 'Godean', 'Kalasan', 'Minggir', 'Mlati', 'Moyudan', 'Ngaglik', 'Ngemplak', 'Pakem', 'Prambanan', 'Seyegan', 'Sleman', 'Tempel', 'Turi',
];

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState('penyuluh');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [wilayah, setWilayah] = useState('');
  const [noHp, setNoHp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }
    setLoading(true);
    // Simulasi register, bisa dihubungkan ke backend nanti
    setTimeout(() => {
      setLoading(false);
      router.push('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Daftar Sebagai</label>
            <select className="w-full border rounded px-3 py-2" value={role} onChange={e => setRole(e.target.value)}>
              <option value="penyuluh">Penyuluh</option>
              <option value="gapoktan">Gapoktan</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Nama {role === 'gapoktan' ? 'Gapoktan' : 'Lengkap'}</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Konfirmasi Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">No. HP</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={noHp} onChange={e => setNoHp(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Wilayah</label>
            <select className="w-full border rounded px-3 py-2" value={wilayah} onChange={e => setWilayah(e.target.value)} required>
              <option value="">Pilih Wilayah</option>
              {wilayahList.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          {role === 'gapoktan' && (
            <div>
              <label className="block mb-1 font-medium">Alamat Lengkap</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={alamat} onChange={e => setAlamat(e.target.value)} required />
            </div>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition" disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Sudah punya akun?{' '}
          <a href="/login" className="text-green-700 hover:underline font-medium">Login</a>
        </div>
      </div>
    </div>
  );
} 