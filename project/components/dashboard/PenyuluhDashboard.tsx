"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, CheckCircle, FileText, Leaf } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import * as api from '@/lib/api';
import { useEffect, useState } from 'react';

export function PenyuluhDashboard() {
  const { user } = useAuth();
  const [stat, setStat] = useState({
    totalGapoktan: 0,
    tugasSelesai: 0,
    totalTugas: 0,
    laporanMasuk: 0,
    totalPanen: 0,
    loading: true,
  });
  const [productivity, setProductivity] = useState<any[]>([]);
  const [harvestTrend, setHarvestTrend] = useState<any[]>([]);
  const [tugasTerbaru, setTugasTerbaru] = useState<any[]>([]);
  const [laporanTerbaru, setLaporanTerbaru] = useState<any[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [gapoktanPanen, setGapoktanPanen] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !user.id) return;
    setStat(s => ({ ...s, loading: true }));
    // Fetch gapoktan binaan
    api.getProfile(user.id).then(res => {
      // Asumsi user punya field wilayah
      const wilayah = res?.profile?.wilayah || '';
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gapoktan?wilayah=${encodeURIComponent(wilayah)}`)
        .then(res => res.json())
        .then(async res => {
          const gapoktanList = res.data || [];
          setStat(s => ({ ...s, totalGapoktan: gapoktanList.length }));
          const gapoktanIds = gapoktanList.map((g: any) => g.id);
          // Fetch panen untuk statistik dan grafik
          setLoadingChart(true);
          api.getPanen().then(res => {
            // Filter panen hanya untuk gapoktan binaan
            const panen = (res.data || []).filter((p: any) => gapoktanIds.includes(p.gapoktan_id));
            // Total panen bulan ini
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const totalPanenBulanIni = panen
              .filter((p: any) => {
                const panenDate = new Date(p.tanggal);
                return panenDate.getMonth() === currentMonth && panenDate.getFullYear() === currentYear;
              })
              .reduce((acc: number, p: any) => acc + Number(p.jumlah), 0);
            setStat(s => ({ ...s, totalPanen: totalPanenBulanIni, loading: false }));
            // Produktivitas Mingguan
            const weekMap: any = {};
            panen.forEach((p: any) => {
              const week = getWeekNumber(new Date(p.tanggal));
              if (!weekMap[week]) weekMap[week] = { week: `Minggu ${week}`, padi: 0, jagung: 0, kedelai: 0, cabai: 0, tomat: 0 };
              const key = (p.komoditas || '').toLowerCase();
              if (weekMap[week][key] !== undefined) weekMap[week][key] += Number(p.jumlah);
            });
            setProductivity(Object.values(weekMap));
            // Tren Panen Bulanan
            const monthMap: any = {};
            panen.forEach((p: any) => {
              const month = new Date(p.tanggal).toLocaleString('id-ID', { month: 'short', year: 'numeric' });
              if (!monthMap[month]) monthMap[month] = { month, harvest: 0 };
              monthMap[month].harvest += Number(p.jumlah);
            });
            setHarvestTrend(Object.values(monthMap));
            setLoadingChart(false);
          });
          // Fetch panen per gapoktan (bulan ini)
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          const panenPerGapoktan = await Promise.all(gapoktanList.map(async (g: any) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/panen/gapoktan/${g.id}`);
            const data = await res.json();
            const totalPanen = (data.data || []).filter((p: any) => {
              const panenDate = new Date(p.tanggal);
              return panenDate.getMonth() === currentMonth && panenDate.getFullYear() === currentYear;
            }).reduce((acc: number, p: any) => acc + Number(p.jumlah), 0);
            return { nama: g.nama, totalPanen };
          }));
          setGapoktanPanen(panenPerGapoktan);
        });
    });
    // Fetch tugas penyuluh
    api.getTugasByPenyuluh(user.id).then(res => {
      const tugas = res.data || [];
      setStat(s => ({ ...s, totalTugas: tugas.length, tugasSelesai: tugas.filter((t: any) => t.status === 'Selesai').length }));
      setTugasTerbaru(tugas.slice(0, 4));
    });
    // Fetch laporan
    api.getLaporan().then(res => {
      const laporan = (res.data || []).filter((l: any) => l.penyuluh_id === user.id);
      setStat(s => ({ ...s, laporanMasuk: laporan.length }));
      setLaporanTerbaru(laporan.slice(0, 4));
    });
  }, [user]);

  const now = new Date();
  const tanggal = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Selamat datang, Penyuluh</h1>
          <p className="text-earth-brown-600">{tanggal} | {jam}</p>
        </div>
      </div>

      {/* Card Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="flex flex-col items-center justify-center py-6">
          <div><Users className="h-6 w-6 text-blue-600" /></div>
          <div className="text-lg font-semibold mt-2">Total Gapoktan</div>
          <div className="text-2xl font-bold mt-1">{stat.loading ? '...' : stat.totalGapoktan}</div>
        </Card>
        <Card className="flex flex-col items-center justify-center py-6">
          <div><CheckCircle className="h-6 w-6 text-green-600" /></div>
          <div className="text-lg font-semibold mt-2">Tugas Selesai</div>
          <div className="text-2xl font-bold mt-1">{stat.loading ? '...' : `${stat.tugasSelesai} dari ${stat.totalTugas} tugas`}</div>
        </Card>
        <Card className="flex flex-col items-center justify-center py-6">
          <div><FileText className="h-6 w-6 text-purple-600" /></div>
          <div className="text-lg font-semibold mt-2">Laporan Masuk</div>
          <div className="text-2xl font-bold mt-1">{stat.loading ? '...' : stat.laporanMasuk}</div>
        </Card>
        <Card className="flex flex-col items-center justify-center py-6">
          <div><Leaf className="h-6 w-6 text-yellow-600" /></div>
          <div className="text-lg font-semibold mt-2">Total Panen</div>
          <div className="text-2xl font-bold mt-1">{stat.loading ? '...' : `${stat.totalPanen} kg bulan ini`}</div>
        </Card>
      </div>

      {/* Grafik dan Tren Panen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle>Produktivitas Mingguan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="padi" fill="#22c55e" />
                <Bar dataKey="jagung" fill="#eab308" />
                <Bar dataKey="kedelai" fill="#8b5cf6" />
                <Bar dataKey="cabai" fill="#ef4444" />
                <Bar dataKey="tomat" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
            {loadingChart && <div className="text-xs text-gray-500 mt-2">Memuat grafik...</div>}
          </CardContent>
        </Card>
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle>Tren Panen</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={harvestTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="harvest" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
            {loadingChart && <div className="text-xs text-gray-500 mt-2">Memuat grafik...</div>}
          </CardContent>
        </Card>
      </div>

      {/* Data Panen per Gapoktan (Bulan Ini) */}
      <Card className="harvest-card mb-8">
        <CardHeader>
          <CardTitle className="text-earth-brown-800 flex items-center gap-2">
            Data Panen per Gapoktan (Bulan Ini)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Gapoktan</th>
                  <th className="px-4 py-2 text-left">Total Panen (kg)</th>
                </tr>
              </thead>
              <tbody>
                {gapoktanPanen.map((g: any) => (
                  <tr key={g.nama}>
                    <td className="px-4 py-2">{g.nama}</td>
                    <td className="px-4 py-2">{g.totalPanen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tugas Terbaru ke Gapoktan */}
      <Card className="harvest-card mb-8">
        <CardHeader>
          <CardTitle className="text-earth-brown-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-earth-green-600" />
            Tugas Terbaru ke Gapoktan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tugasTerbaru.length === 0 && <div className="text-sm text-earth-brown-600">Tidak ada tugas.</div>}
            {tugasTerbaru.slice(0, 4).map((t: any, i: number) => (
              <div key={i} className="p-3 bg-earth-green-50 rounded-lg border border-earth-green-200">
                <h4 className="font-medium text-earth-brown-800">{t.judul || t.tugas}</h4>
                <p className="text-sm text-earth-brown-600 mt-1">{t.gapoktan || t.gapoktan_nama}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-earth-brown-600">{t.deadline || (t.mulai ? new Date(t.mulai).toLocaleDateString('id-ID') : '-')}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    t.status === 'Proses' ? 'bg-yellow-100 text-yellow-700' :
                    t.status === 'Belum' ? 'bg-gray-100 text-gray-700' :
                    'bg-green-100 text-green-700'}`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Laporan Masuk Terbaru */}
      <Card className="harvest-card mb-8">
          <CardHeader>
            <CardTitle className="text-earth-brown-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-earth-green-600" />
            Laporan Masuk Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-3">
            {laporanTerbaru.length === 0 && <div className="text-sm text-earth-brown-600">Tidak ada laporan.</div>}
            {laporanTerbaru.slice(0, 4).map((l: any, i: number) => (
              <div key={i} className="p-3 bg-earth-brown-50 rounded-lg border border-earth-brown-200">
                <h4 className="font-medium text-earth-brown-800">{l.judul_laporan || l.judul}</h4>
                <p className="text-sm text-earth-brown-600 mt-1">{l.gapoktan_nama || l.gapoktan}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-earth-brown-600">{l.tanggal_laporan ? new Date(l.tanggal_laporan).toLocaleDateString('id-ID') : (l.tanggal ? new Date(l.tanggal).toLocaleDateString('id-ID') : '-')}</span>
                </div>
              </div>
            ))}
          </div>
          </CardContent>
        </Card>
    </div>
  );
}

function getWeekNumber(date: Date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDay.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7);
}