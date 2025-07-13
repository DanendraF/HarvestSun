"use client"

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import * as api from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';
import { Eye, Pencil, Trash2 } from 'lucide-react';

const sampleKonsultan = [
  { id: '1', nama: 'Ahmad Susanto' },
  { id: '2', nama: 'Siti Rahayu' },
  { id: '3', nama: 'Budi Hartono' },
];

const jenisTugas = ['Survei', 'Pendampingan', 'Pelaporan', 'Edukasi', 'Pemantauan'];
const prioritasList = ['Rendah', 'Sedang', 'Tinggi'];
const wilayahList = ['Lahan A', 'Lahan B', 'Lahan C'];

const statusIcon = (status: string) =>
  status === 'Selesai' ? (
    <span className="inline-flex items-center gap-1 text-green-600"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>Selesai</span>
  ) : (
    <span className="inline-flex items-center gap-1 text-yellow-600"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M12 8v4l2 2"/></svg>{status}</span>
  );

export default function TugasPenyuluhPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tugas, setTugas] = useState<any[]>([]);
  const [gapoktanList, setGapoktanList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    judul: '',
    deskripsi: '',
    gapoktan_id: '',
    wilayah: '',
    jenis: '',
    mulai: '',
    selesai: '',
    prioritas: '',
    lampiran: null as File | null,
    catatan: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [notif, setNotif] = useState<string | null>(null);
  // Tambahkan state editId untuk membedakan tambah/edit
  const [editId, setEditId] = useState<string | null>(null);
  // State untuk modal view tugas
  const [viewTugas, setViewTugas] = useState<any | null>(null);

  // Fetch daftar gapoktan satu wilayah
  useEffect(() => {
    if (!loading && user) {
      // Fetch gapoktan satu wilayah dari backend
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/gapoktan?wilayah=${encodeURIComponent(user.region || '')}`)
        .then(res => res.json())
        .then(res => setGapoktanList(res.data || []))
        .catch(() => setGapoktanList([]));
      // Fetch tugas milik penyuluh
      api.getTugasByPenyuluh(user.id).then(res => setTugas(res.data)).catch(() => setTugas([]));
    }
  }, [user, loading]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'penyuluh') {
        if (user.role === 'gapoktan') router.push('/gapoktan/dashboard');
        else if (user.role === 'admin') router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'penyuluh') return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name === 'lampiran') {
      setForm(f => ({ ...f, lampiran: files[0] }));
    } else if (name === 'gapoktan_id') {
      // Update wilayah otomatis saat gapoktan dipilih
      const gapoktan = gapoktanList.find(g => g.id === value);
      setForm(f => ({ ...f, gapoktan_id: value, wilayah: gapoktan ? gapoktan.wilayah : '' }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Ubah handleSubmit agar bisa update jika editId ada
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setNotif(null);
    // Validasi field wajib
    if (!form.judul || !form.deskripsi || !form.gapoktan_id || !form.jenis || !form.mulai || !form.selesai || !form.prioritas) {
      setNotif('Semua field wajib diisi!');
      setLoadingSubmit(false);
      return;
    }
    try {
      // Cari gapoktan terpilih
      const gapoktan = gapoktanList.find(g => g.id === form.gapoktan_id);
      if (!gapoktan) throw new Error('Gapoktan tidak ditemukan');
      let lampiran_url = null;
      // Upload file jika ada lampiran
      if (form.lampiran) {
        const fileExt = form.lampiran.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { data, error } = await supabase
          .storage
          .from('lampiran-tugas')
          .upload(fileName, form.lampiran);
        if (error) throw new Error('Gagal upload lampiran');
        const { data: publicData } = supabase
          .storage
          .from('lampiran-tugas')
          .getPublicUrl(fileName);
        lampiran_url = publicData.publicUrl;
      }
      if (editId) {
        await api.updateTugas(editId, {
          judul: form.judul,
          deskripsi: form.deskripsi,
          gapoktan_id: gapoktan.id,
          gapoktan_nama: gapoktan.nama,
          wilayah: form.wilayah,
          jenis: form.jenis,
          mulai: form.mulai,
          selesai: form.selesai,
          prioritas: form.prioritas,
          lampiran_url,
          catatan: form.catatan,
          penyuluh_id: user.id,
          penyuluh_nama: user.name,
        });
        setNotif('Tugas berhasil diupdate!');
      } else {
        await api.createTugas({
        judul: form.judul,
        deskripsi: form.deskripsi,
          gapoktan_id: gapoktan.id,
          gapoktan_nama: gapoktan.nama,
          wilayah: form.wilayah,
        jenis: form.jenis,
        mulai: form.mulai,
        selesai: form.selesai,
        prioritas: form.prioritas,
          lampiran_url,
        catatan: form.catatan,
          status: 'Belum Selesai',
          penyuluh_id: user.id,
          penyuluh_nama: user.name,
        });
        setNotif('Tugas berhasil ditambahkan!');
      }
    setShowModal(false);
      setForm({ judul: '', deskripsi: '', gapoktan_id: '', wilayah: '', jenis: '', mulai: '', selesai: '', prioritas: '', lampiran: null, catatan: '' });
      setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
      // Refresh daftar tugas
      const res = await api.getTugasByPenyuluh(user.id);
      setTugas(res.data);
    } catch (err: any) {
      setNotif(err.message || 'Gagal simpan tugas');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-8xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Tugas Penyuluh</h1>
            <p className="text-earth-brown-600">Tambah tugas untuk Gapoktan dan pantau statusnya.</p>
          </div>
          <button
            className="bg-green-600 text-white px-5 py-2 rounded font-semibold hover:bg-green-700 transition-all shadow-sm"
            onClick={() => setShowModal(true)}
          >
            Tambah Tugas
          </button>
        </div>
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative animate-fadeIn">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl" onClick={() => { setShowModal(false); setEditId(null); }}>&times;</button>
              <h2 className="text-xl font-bold mb-4">Tambah Tugas untuk Gapoktan</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Judul Tugas</label>
                  <input type="text" name="judul" className="w-full border rounded px-3 py-2" value={form.judul} onChange={handleChange} placeholder="Ringkasan tugas" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi Tugas</label>
                  <textarea name="deskripsi" className="w-full border rounded px-3 py-2" value={form.deskripsi} onChange={handleChange} placeholder="Penjelasan lengkap tugas" required />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Gapoktan</label>
                    <select name="gapoktan_id" className="w-full border rounded px-3 py-2" value={form.gapoktan_id} onChange={handleChange} required>
                      <option value="">Pilih Gapoktan</option>
                      {gapoktanList.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Wilayah</label>
                    <select name="wilayah" className="w-full border rounded px-3 py-2" value={form.wilayah} onChange={handleChange} required>
                      <option value="">Pilih Wilayah</option>
                      {wilayahList.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Jenis Tugas</label>
                    <select name="jenis" className="w-full border rounded px-3 py-2" value={form.jenis} onChange={handleChange} required>
                      <option value="">Pilih Jenis</option>
                      {jenisTugas.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Prioritas</label>
                    <select name="prioritas" className="w-full border rounded px-3 py-2" value={form.prioritas} onChange={handleChange} required>
                      <option value="">Pilih Prioritas</option>
                      {prioritasList.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
                    <input type="date" name="mulai" className="w-full border rounded px-3 py-2" value={form.mulai} onChange={handleChange} required />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Tanggal Selesai</label>
                    <input type="date" name="selesai" className="w-full border rounded px-3 py-2" value={form.selesai} onChange={handleChange} required />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Lampiran (opsional)</label>
                    <input ref={fileInputRef} type="file" name="lampiran" className="w-full border rounded px-3 py-2" onChange={handleChange} accept=".pdf,image/*,.doc,.docx" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catatan Tambahan (opsional)</label>
                  <textarea name="catatan" className="w-full border rounded px-3 py-2" value={form.catatan} onChange={handleChange} placeholder="Keterangan khusus atau permintaan tambahan" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => { setShowModal(false); setEditId(null); }}>Batal</button>
                  <button type="submit" className="px-5 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition-all" disabled={loadingSubmit}>
                    {loadingSubmit ? 'Menyimpan...' : 'Simpan Tugas'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal View Tugas */}
        {viewTugas && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative animate-fadeIn">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl" onClick={() => setViewTugas(null)}>&times;</button>
              <h2 className="text-xl font-bold mb-4">Detail Tugas</h2>
              <div className="space-y-2">
                <div><span className="font-semibold">Judul:</span> {viewTugas.judul}</div>
                <div><span className="font-semibold">Deskripsi:</span> {viewTugas.deskripsi}</div>
                <div><span className="font-semibold">Gapoktan:</span> {viewTugas.gapoktan_nama}</div>
                <div><span className="font-semibold">Wilayah:</span> {viewTugas.wilayah}</div>
                <div><span className="font-semibold">Jenis:</span> {viewTugas.jenis}</div>
                <div><span className="font-semibold">Prioritas:</span> {viewTugas.prioritas}</div>
                <div><span className="font-semibold">Tanggal Mulai:</span> {viewTugas.mulai}</div>
                <div><span className="font-semibold">Tanggal Selesai:</span> {viewTugas.selesai}</div>
                <div><span className="font-semibold">Status:</span> {viewTugas.status}</div>
                <div><span className="font-semibold">Catatan:</span> {viewTugas.catatan || '-'}</div>
                {viewTugas.lampiran_url && (
                  <div><span className="font-semibold">Lampiran:</span> <a href={viewTugas.lampiran_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat Lampiran</a></div>
                )}
              </div>
              <div className="flex justify-end mt-6">
                <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setViewTugas(null)}>Tutup</button>
              </div>
            </div>
          </div>
        )}
        {notif && <div className="my-4 p-3 rounded bg-green-100 text-green-800 font-semibold">{notif}</div>}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-200 rounded-xl bg-white shadow-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 border-b font-semibold">No</th>
                <th className="py-3 px-4 border-b text-left font-semibold">Judul</th>
                <th className="py-3 px-4 border-b font-semibold">Konsultan</th>
                <th className="py-3 px-4 border-b font-semibold">Jenis</th>
                <th className="py-3 px-4 border-b font-semibold">Prioritas</th>
                <th className="py-3 px-4 border-b font-semibold">Deadline</th>
                <th className="py-3 px-4 border-b font-semibold">Status</th>
                <th className="py-3 px-4 border-b font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tugas.map((t, i) => (
                <tr key={t.id || i} className="text-center transition hover:bg-green-50/60">
                  <td className="py-2 px-4 border-b">{i + 1}</td>
                  <td className="py-2 px-4 border-b text-left">{t.judul}</td>
                  <td className="py-2 px-4 border-b">{t.gapoktan_nama}</td>
                  <td className="py-2 px-4 border-b">{t.jenis}</td>
                  <td className="py-2 px-4 border-b">{t.prioritas}</td>
                  <td className="py-2 px-4 border-b">{t.selesai}</td>
                  <td className="py-2 px-4 border-b">{t.status}</td>
                  <td className="py-2 px-4 border-b flex gap-2 justify-center">
                    <button
                      title="Lihat Detail"
                      className="p-2 rounded hover:bg-green-100 transition-all"
                      onClick={() => setViewTugas(t)}
                    >
                      <Eye className="h-5 w-5 text-green-600" />
                    </button>
                    <button
                      title="Edit Tugas"
                      className="p-2 rounded hover:bg-yellow-100 transition-all"
                      onClick={() => {
                        setForm({
                          judul: t.judul,
                          deskripsi: t.deskripsi,
                          gapoktan_id: t.gapoktan_id,
                          wilayah: t.wilayah,
                          jenis: t.jenis,
                          mulai: t.mulai,
                          selesai: t.selesai,
                          prioritas: t.prioritas,
                          lampiran: null,
                          catatan: t.catatan || '',
                        });
                        setEditId(t.id);
                        setShowModal(true);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <Pencil className="h-5 w-5 text-yellow-500" />
                    </button>
                    <button
                      title="Hapus Tugas"
                      className="p-2 rounded hover:bg-red-100 transition-all"
                      onClick={async () => {
                        if (window.confirm('Yakin ingin menghapus tugas ini?')) {
                          try {
                            await api.deleteTugas(t.id);
                            setNotif('Tugas berhasil dihapus!');
                            const res = await api.getTugasByPenyuluh(user.id);
                            setTugas(res.data);
                          } catch (err: any) {
                            setNotif(err.message || 'Gagal hapus tugas');
                          }
                        }
                      }}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
} 