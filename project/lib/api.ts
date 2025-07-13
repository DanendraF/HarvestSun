// project/lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// AUTH
export async function register(data: any) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Register gagal');
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Login gagal');
  return res.json();
}

export async function logout() {
  await fetch(`${BASE_URL}/auth/logout`, { method: 'POST' });
}

export async function getMe() {
  const res = await fetch(`${BASE_URL}/auth/me`);
  if (!res.ok) return null;
  return res.json();
}

export async function getProfile(userId: string) {
  const res = await fetch(`${BASE_URL}/auth/profile?id=${userId}`);
  if (!res.ok) return null;
  return res.json();
}

// TUGAS PENYULUH - GAPOKTAN
export async function createTugas(data: any) {
  const res = await fetch(`${BASE_URL}/tugas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Gagal tambah tugas');
  return res.json();
}

export async function getAllTugas() {
  const res = await fetch(`${BASE_URL}/tugas`);
  if (!res.ok) throw new Error((await res.json()).error || 'Gagal ambil tugas');
  return res.json();
}

export async function getTugasByGapoktan(gapoktan_id: string) {
  const res = await fetch(`${BASE_URL}/tugas/gapoktan/${gapoktan_id}`);
  if (!res.ok) throw new Error((await res.json()).error || 'Gagal ambil tugas gapoktan');
  return res.json();
}

export async function getTugasByPenyuluh(penyuluh_id: string) {
  const res = await fetch(`${BASE_URL}/tugas/penyuluh/${penyuluh_id}`);
  if (!res.ok) throw new Error((await res.json()).error || 'Gagal ambil tugas penyuluh');
  return res.json();
}

export async function updateTugas(id: string, update: any) {
  const res = await fetch(`${BASE_URL}/tugas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Gagal update tugas');
  return res.json();
}

export async function deleteTugas(id: string) {
  const res = await fetch(`${BASE_URL}/tugas/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error((await res.json()).error || 'Gagal hapus tugas');
  return res.json();
}

// LAPORAN
export async function createLaporan(data: any) {
  const res = await fetch(`${BASE_URL}/laporan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Gagal tambah laporan');
  return res.json();
}

export async function getLaporan() {
  const res = await fetch(`${BASE_URL}/laporan`);
  if (!res.ok) throw new Error((await res.json()).error || 'Gagal ambil laporan');
  return res.json();
}

export async function getLaporanByGapoktan(gapoktan_id: string) {
  const res = await fetch(`${BASE_URL}/laporan/gapoktan/${gapoktan_id}`);
  if (!res.ok) throw new Error((await res.json()).error || 'Gagal ambil laporan gapoktan');
  return res.json();
}

export async function getLaporanByTugas(tugas_id: string) {
  const res = await fetch(`${BASE_URL}/laporan/tugas/${tugas_id}`);
  if (!res.ok) throw new Error((await res.json()).error || 'Gagal ambil laporan tugas');
  return res.json();
}

export async function updateLaporan(id: string, update: any) {
  const res = await fetch(`${BASE_URL}/laporan/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Gagal update laporan');
  return res.json();
} 