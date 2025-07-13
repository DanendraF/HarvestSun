'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Clock, MapPin, Users, Check } from 'lucide-react';
import { agendaItems } from '@/data/sampleData';
import { useAuth } from '@/hooks/useAuth';
import * as api from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const { user, loading } = useAuth();
  const [tugasPenyuluh, setTugasPenyuluh] = useState<any[]>([]);
  const [showLaporanModal, setShowLaporanModal] = useState(false);
  const [laporanForm, setLaporanForm] = useState<any>({});
  const [laporanLoading, setLaporanLoading] = useState(false);
  const [notif, setNotif] = useState<string | null>(null);
  const [selectedTugas, setSelectedTugas] = useState<any | null>(null);

  useEffect(() => {
    if (user && user.id) {
      api.getTugasByGapoktan(user.id)
        .then(res => setTugasPenyuluh(res.data || []))
        .catch(() => setTugasPenyuluh([]));
    }
  }, [user]);

  const getAgendaForDate = (date: Date) => {
    return agendaItems.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.toDateString() === date.toDateString();
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'inspection': return 'bg-green-100 text-green-800';
      case 'harvest': return 'bg-yellow-100 text-yellow-800';
      case 'training': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handler buka modal laporan
  const handleOpenLaporanModal = (tugas: any) => {
    if (!user) {
      setNotif('User tidak ditemukan!');
      return;
    }
    setSelectedTugas(tugas);
    setLaporanForm({
      judul_laporan: tugas.judul,
      isi_laporan: '',
      tanggal_laporan: new Date().toISOString().slice(0, 10),
      lampiran: null,
    });
    setShowLaporanModal(true);
  };

  // Handler submit laporan
  const handleSubmitLaporan = async (e: any) => {
    e.preventDefault();
    setLaporanLoading(true);
    setNotif(null);
    if (!user) {
      setNotif('User tidak ditemukan!');
      setLaporanLoading(false);
      return;
    }
    if (!laporanForm.lampiran) {
      setNotif('Lampiran wajib diunggah!');
      setLaporanLoading(false);
      return;
    }
    try {
      let lampiran_url = null;
      if (laporanForm.lampiran) {
        const fileExt = laporanForm.lampiran.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { data, error } = await supabase
          .storage
          .from('lampiran-laporan')
          .upload(fileName, laporanForm.lampiran);
        if (error) throw new Error('Gagal upload lampiran');
        const { data: publicData } = supabase
          .storage
          .from('lampiran-laporan')
          .getPublicUrl(fileName);
        lampiran_url = publicData.publicUrl;
      }
      await api.createLaporan({
        tugas_id: selectedTugas.id,
        gapoktan_id: user.id,
        judul_laporan: laporanForm.judul_laporan,
        isi_laporan: laporanForm.isi_laporan,
        tanggal_laporan: laporanForm.tanggal_laporan,
        status_laporan: 'Belum Divalidasi',
        lampiran: lampiran_url,
        catatan_penyuluh: '',
        penyuluh_id: selectedTugas.penyuluh_id,
        penyuluh_nama: selectedTugas.penyuluh_nama,
      });
      // Update status tugas menjadi 'Verifikasi Laporan'
      await api.updateTugas(selectedTugas.id, { status: 'Verifikasi Laporan' });
      setNotif('Laporan berhasil dikirim!');
      setShowLaporanModal(false);
      setSelectedTugas(null);
      setLaporanForm({});
      // Refresh data tugas
      if (user && user.id) {
        api.getTugasByGapoktan(user.id)
          .then(res => setTugasPenyuluh(res.data || []))
          .catch(() => setTugasPenyuluh([]));
      }
    } catch (err: any) {
      setNotif(err.message || 'Gagal kirim laporan');
    } finally {
      setLaporanLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-earth-brown-800">Agenda</h1>
            <p className="text-earth-brown-600 mt-1">Kelola jadwal dan kegiatan harian</p>
          </div>
          <Button className="bg-earth-green-600 hover:bg-earth-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Agenda
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <Card className="lg:col-span-2 harvest-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-earth-brown-800 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-earth-green-600" />
                  Kalender Agenda
                </CardTitle>
                <div className="flex gap-2">
                  {['day', 'week', 'month'].map((mode) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode(mode as 'day' | 'week' | 'month')}
                      className={viewMode === mode ? 'bg-earth-green-600 hover:bg-earth-green-700' : ''}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tugasPenyuluh.map((tugas) => (
                  <div key={tugas.id} className="p-4 bg-earth-green-50 rounded-lg border border-earth-green-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-earth-brown-800">{tugas.judul}</h3>
                        <p className="text-sm text-earth-brown-600 mt-1">{tugas.deskripsi}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-earth-brown-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {tugas.mulai} • {tugas.selesai}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {tugas.gapoktan_nama}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-earth-brown-600">
                          <span><b>Jenis:</b> {tugas.jenis}</span>
                          <span><b>Prioritas:</b> {tugas.prioritas}</span>
                          <span><b>Status:</b> {tugas.status}</span>
                          <span><b>Penyuluh:</b> {tugas.penyuluh_nama}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getTypeColor(tugas.jenis)}>
                          {tugas.jenis}
                        </Badge>
                        {tugas.status === 'Verifikasi Laporan' ? (
                          <span title="Menunggu verifikasi penyuluh" className="p-2 rounded bg-yellow-50 cursor-not-allowed">
                            <Clock className="h-5 w-5 text-yellow-500" />
                          </span>
                        ) : (
                          <button
                            title="Selesaikan & Buat Laporan"
                            className="p-2 rounded hover:bg-green-100 transition-all"
                            onClick={() => handleOpenLaporanModal(tugas)}
                          >
                            <Check className="h-5 w-5 text-green-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="harvest-card">
            <CardHeader>
              <CardTitle className="text-earth-brown-800">Agenda Mendatang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tugasPenyuluh.slice(0, 5).map((tugas) => (
                  <div key={tugas.id} className="p-3 bg-earth-brown-50 rounded-lg">
                    <h4 className="font-medium text-earth-brown-800 text-sm">{tugas.judul}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-earth-brown-600" />
                      <span className="text-xs text-earth-brown-600">
                        {tugas.mulai}
                      </span>
                    </div>
                    <Badge className={`${getTypeColor(tugas.jenis)} text-xs mt-2`}>
                      {tugas.jenis}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Rapat</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {tugasPenyuluh.filter(tugas => tugas.jenis === 'meeting').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Inspeksi</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {tugasPenyuluh.filter(tugas => tugas.jenis === 'inspection').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Panen</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {tugasPenyuluh.filter(tugas => tugas.jenis === 'harvest').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Training</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {tugasPenyuluh.filter(tugas => tugas.jenis === 'training').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Laporan */}
      {showLaporanModal && selectedTugas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative animate-fadeIn">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl" onClick={() => setShowLaporanModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Buat Laporan Tugas</h2>
            <form onSubmit={handleSubmitLaporan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul Laporan</label>
                <input type="text" className="w-full border rounded px-3 py-2" value={laporanForm.judul_laporan || ''} onChange={e => setLaporanForm((f: any) => ({ ...f, judul_laporan: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Isi Laporan</label>
                <textarea className="w-full border rounded px-3 py-2" value={laporanForm.isi_laporan || ''} onChange={e => setLaporanForm((f: any) => ({ ...f, isi_laporan: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal Laporan</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={laporanForm.tanggal_laporan || ''} onChange={e => setLaporanForm((f: any) => ({ ...f, tanggal_laporan: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lampiran <span className="text-red-600">*</span></label>
                <input type="file" className="w-full border rounded px-3 py-2" required onChange={e => setLaporanForm((f: any) => ({ ...f, lampiran: e.target.files?.[0] }))} accept=".pdf,image/*,.doc,.docx" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowLaporanModal(false)}>Batal</button>
                <button type="submit" className="px-5 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition-all" disabled={laporanLoading}>
                  {laporanLoading ? 'Menyimpan...' : 'Simpan Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {notif && <div className="my-4 p-3 rounded bg-green-100 text-green-800 font-semibold">{notif}</div>}
    </DashboardLayout>
  );
}