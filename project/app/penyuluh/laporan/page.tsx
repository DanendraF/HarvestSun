"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import * as api from '@/lib/api';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

export default function LaporanPenyuluhPage() {
  const { user, loading } = useAuth();
  const [laporan, setLaporan] = useState<any[]>([]);
  const [notif, setNotif] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailLaporan, setDetailLaporan] = useState<any | null>(null);
  const [showValidasi, setShowValidasi] = useState(false);
  const [validasiForm, setValidasiForm] = useState({ status_laporan: 'Valid', catatan_penyuluh: '' });
  const [loadingValidasi, setLoadingValidasi] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      api.getLaporan()
        .then(res => {
          // Filter laporan yang tugasnya dibuat oleh penyuluh ini
          const filtered = (res.data || []).filter((lap: any) => lap.penyuluh_id === user.id);
          setLaporan(filtered);
        })
        .catch(() => setLaporan([]));
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Belum Divalidasi': return 'bg-blue-100 text-blue-800';
      case 'Valid': return 'bg-green-100 text-green-800';
      case 'Perlu Revisi': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handler buka modal detail
  const handleShowDetail = (lap: any) => {
    setDetailLaporan(lap);
    setShowDetail(true);
  };
  // Handler buka modal validasi
  const handleShowValidasi = (lap: any) => {
    setDetailLaporan(lap);
    setValidasiForm({ status_laporan: 'Valid', catatan_penyuluh: '' });
    setShowValidasi(true);
  };
  // Handler submit validasi
  const handleSubmitValidasi = async (e: any) => {
    e.preventDefault();
    setLoadingValidasi(true);
    setNotif(null);
    try {
      await api.updateLaporan(detailLaporan.id, {
        status_laporan: validasiForm.status_laporan,
        catatan_penyuluh: validasiForm.catatan_penyuluh,
      });
      setNotif('Laporan berhasil divalidasi!');
      setShowValidasi(false);
      setDetailLaporan(null);
      // Refresh data
      if (user && user.id) {
        api.getLaporan()
          .then(res => {
            const filtered = (res.data || []).filter((lap: any) => lap.penyuluh_id === user.id);
            setLaporan(filtered);
          })
          .catch(() => setLaporan([]));
      }
    } catch (err: any) {
      setNotif(err.message || 'Gagal validasi laporan');
    } finally {
      setLoadingValidasi(false);
    }
  };
  // Handler shortcut Perlu Revisi
  const handleRevisi = async (lap: any) => {
    setNotif(null);
    try {
      await api.updateLaporan(lap.id, { status_laporan: 'Perlu Revisi' });
      setNotif('Laporan dikembalikan untuk revisi!');
      if (user && user.id) {
        api.getLaporan()
          .then(res => {
            const filtered = (res.data || []).filter((lap: any) => lap.penyuluh_id === user.id);
            setLaporan(filtered);
          })
          .catch(() => setLaporan([]));
      }
    } catch (err: any) {
      setNotif(err.message || 'Gagal update laporan');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-8xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Panel Laporan Gapoktan</h1>
            <p className="text-earth-brown-600">Verifikasi laporan hasil tugas dari gapoktan.</p>
          </div>
        </div>
        {notif && <div className="my-4 p-3 rounded bg-green-100 text-green-800 font-semibold">{notif}</div>}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-200 rounded-xl bg-white shadow-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 border-b font-semibold">No</th>
                <th className="py-3 px-4 border-b font-semibold">Judul Laporan</th>
                <th className="py-3 px-4 border-b font-semibold">Gapoktan</th>
                <th className="py-3 px-4 border-b font-semibold">Isi Singkat</th>
                <th className="py-3 px-4 border-b font-semibold">Tanggal</th>
                <th className="py-3 px-4 border-b font-semibold">Status</th>
                <th className="py-3 px-4 border-b font-semibold">Lampiran</th>
                <th className="py-3 px-4 border-b font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {laporan.map((lap, i) => (
                <tr key={lap.id || i} className="text-center transition hover:bg-green-50/60">
                  <td className="py-2 px-4 border-b">{i + 1}</td>
                  <td className="py-2 px-4 border-b text-left">{lap.judul_laporan}</td>
                  <td className="py-2 px-4 border-b">{lap.gapoktan_nama || '-'}</td>
                  <td className="py-2 px-4 border-b text-left">{lap.isi_laporan?.substring(0, 60)}...</td>
                  <td className="py-2 px-4 border-b">{lap.tanggal_laporan ? dayjs(lap.tanggal_laporan).locale('id').format('DD MMMM YYYY') : '-'}</td>
                  <td className="py-2 px-4 border-b">
                    <Badge className={getStatusColor(lap.status_laporan)}>{lap.status_laporan}</Badge>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {lap.lampiran && (
                      <a href={lap.lampiran} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        <Download className="inline h-5 w-5 mr-1" />Download
                      </a>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b flex gap-2 justify-center">
                    <Button size="sm" variant="outline" onClick={() => handleShowDetail(lap)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" disabled={lap.status_laporan !== 'Belum Divalidasi'} onClick={() => handleShowValidasi(lap)}>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button size="sm" variant="outline" disabled={lap.status_laporan !== 'Belum Divalidasi'} onClick={() => handleRevisi(lap)}>
                      <XCircle className="h-4 w-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal Detail Laporan */}
      {showDetail && detailLaporan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative animate-fadeIn">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl" onClick={() => setShowDetail(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Detail Laporan</h2>
            <div className="space-y-2">
              <div><span className="font-semibold">Judul:</span> {detailLaporan.judul_laporan}</div>
              <div><span className="font-semibold">Gapoktan:</span> {detailLaporan.gapoktan_nama || '-'}</div>
              <div><span className="font-semibold">Isi Laporan:</span> {detailLaporan.isi_laporan}</div>
              <div><span className="font-semibold">Tanggal:</span> {detailLaporan.tanggal_laporan ? dayjs(detailLaporan.tanggal_laporan).locale('id').format('DD MMMM YYYY') : '-'}</div>
              <div><span className="font-semibold">Status:</span> {detailLaporan.status_laporan}</div>
              {detailLaporan.lampiran && (
                <div><span className="font-semibold">Lampiran:</span> <a href={detailLaporan.lampiran} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a></div>
              )}
              {detailLaporan.catatan_penyuluh && (
                <div className="mt-2 text-xs text-yellow-700 bg-yellow-50 rounded p-2">Catatan Penyuluh: {detailLaporan.catatan_penyuluh}</div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowDetail(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Validasi Laporan */}
      {showValidasi && detailLaporan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative animate-fadeIn">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl" onClick={() => setShowValidasi(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Validasi Laporan</h2>
            <form onSubmit={handleSubmitValidasi} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status Laporan</label>
                <select className="w-full border rounded px-3 py-2" value={validasiForm.status_laporan} onChange={e => setValidasiForm(f => ({ ...f, status_laporan: e.target.value }))} required>
                  <option value="Valid">Valid</option>
                  <option value="Perlu Revisi">Perlu Revisi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catatan Penyuluh (opsional)</label>
                <textarea className="w-full border rounded px-3 py-2" value={validasiForm.catatan_penyuluh} onChange={e => setValidasiForm(f => ({ ...f, catatan_penyuluh: e.target.value }))} placeholder="Tulis feedback atau revisi jika perlu" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowValidasi(false)}>Batal</button>
                <button type="submit" className="px-5 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition-all" disabled={loadingValidasi}>
                  {loadingValidasi ? 'Menyimpan...' : 'Simpan Validasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 