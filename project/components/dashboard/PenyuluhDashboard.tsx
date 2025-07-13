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

const summaryStats = [
  { icon: <Users className="h-6 w-6 text-blue-600" />, title: 'Total Gapoktan', value: '8 Gapoktan binaan' },
  { icon: <CheckCircle className="h-6 w-6 text-green-600" />, title: 'Tugas Selesai', value: '24 dari 30 tugas' },
  { icon: <FileText className="h-6 w-6 text-purple-600" />, title: 'Laporan Masuk', value: '12 minggu ini' },
  { icon: <Leaf className="h-6 w-6 text-yellow-600" />, title: 'Total Panen', value: '3.800 kg bulan ini' },
];

const productivityData = [
  { week: 'Minggu 1', padi: 800, jagung: 400, tomat: 200 },
  { week: 'Minggu 2', padi: 1200, jagung: 600, tomat: 300 },
  { week: 'Minggu 3', padi: 900, jagung: 500, tomat: 250 },
  { week: 'Minggu 4', padi: 1100, jagung: 700, tomat: 350 },
];

const harvestTrendData = [
  { month: 'Sep', harvest: 9000 },
  { month: 'Oct', harvest: 9500 },
  { month: 'Nov', harvest: 9800 },
  { month: 'Dec', harvest: 10200 },
  { month: 'Jan', harvest: 10500 },
];

const tugasTerbaru = [
  { gapoktan: 'Tani Jaya', tugas: 'Pendataan Lahan', deadline: '12 Jul 2025', status: 'Proses' },
  { gapoktan: 'Maju Mapan', tugas: 'Monitoring Jagung', deadline: '10 Jul 2025', status: 'Belum' },
];

const laporanTerbaru = [
  { gapoktan: 'Tani Jaya', judul: 'Hasil Panen Padi', tanggal: '09 Jul 2025' },
  { gapoktan: 'Subur Makmur', judul: 'Kendala Hama', tanggal: '08 Jul 2025' },
];

export function PenyuluhDashboard() {
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
        {/* Hapus tombol profil dan logout di kanan atas */}
      </div>

      {/* Card Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {summaryStats.map((stat, i) => (
          <Card key={i} className="flex flex-col items-center justify-center py-6">
            <div>{stat.icon}</div>
            <div className="text-lg font-semibold mt-2">{stat.title}</div>
            <div className="text-2xl font-bold mt-1">{stat.value}</div>
        </Card>
        ))}
      </div>

      {/* Grafik dan Tren Panen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle>Produktivitas Mingguan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="padi" fill="#22c55e" />
                <Bar dataKey="jagung" fill="#eab308" />
                <Bar dataKey="tomat" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle>Tren Panen</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={harvestTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="harvest" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
            {tugasTerbaru.slice(0, 4).map((t, i) => (
              <div key={i} className="p-3 bg-earth-green-50 rounded-lg border border-earth-green-200">
                <h4 className="font-medium text-earth-brown-800">{t.tugas}</h4>
                <p className="text-sm text-earth-brown-600 mt-1">{t.gapoktan}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-earth-brown-600">{t.deadline}</span>
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
            {laporanTerbaru.slice(0, 4).map((l, i) => (
              <div key={i} className="p-3 bg-earth-brown-50 rounded-lg border border-earth-brown-200">
                <h4 className="font-medium text-earth-brown-800">{l.judul}</h4>
                <p className="text-sm text-earth-brown-600 mt-1">{l.gapoktan}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-earth-brown-600">{l.tanggal}</span>
                  {/* Bisa tambahkan badge status jika ada */}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      {/* Mini Map Wilayah Gapoktan (opsional) */}
      <Card>
          <CardHeader>
          <CardTitle>Peta Wilayah Gapoktan</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="h-64 w-full bg-green-100 rounded-lg flex items-center justify-center">
            <MapPin className="h-12 w-12 text-green-600" />
            <span className="ml-2 text-earth-brown-600">Mini map dummy (bisa integrasi peta interaktif)</span>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}