'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Wheat,
  CloudRain,
  TrendingUp,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Calendar,
  FileText
} from 'lucide-react';
import Image from 'next/image';
import { harvestData, weatherAlerts, productivityData, harvestTrendData, checklistItems, agendaItems, reports } from '@/data/sampleData';
import { useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import * as api from '@/lib/api';
import { getPanenByGapoktan } from '@/lib/api';

const WILAYAH_JOGJA = [
  { label: 'Yogyakarta', query: 'Yogyakarta' },
  { label: 'Sleman', query: 'Sleman' },
  { label: 'Bantul', query: 'Bantul' },
  { label: 'Kulon Progo', query: 'Wates' }, // ibu kota Kulon Progo
  { label: 'Gunungkidul', query: 'Wonosari' }, // ibu kota Gunungkidul
];

function CuacaCarousel() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const perPage = 5;

  // Simpan juga alert cuaca dari API
  const [cuacaAlerts, setCuacaAlerts] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all(
      WILAYAH_JOGJA.map(async (wil) => {
        try {
          const res = await fetch(`/api/cuaca?kota=${encodeURIComponent(wil.query)}`);
          const json = await res.json();
          return { ...wil, ...json };
        } catch {
          return { ...wil, error: 'Gagal fetch' };
        }
      })
    ).then((result) => {
      setData(result);
      // Kumpulkan semua alert dari API jika ada
      const allAlerts = result.flatMap((item) => {
        if (item.alerts && Array.isArray(item.alerts)) {
          return item.alerts.map((alert: any) => ({
            ...alert,
            location: item.label
          }));
        }
        return [];
      });
      setCuacaAlerts(allAlerts);
    }).finally(() => setLoading(false));
  }, []);

  const handlePrev = () => setStartIndex((prev) => Math.max(prev - perPage, 0));
  const handleNext = () => setStartIndex((prev) => Math.min(prev + perPage, data.length - perPage));

  if (loading) return <div className="mb-2">Memuat data cuaca...</div>;
  if (error) return <div className="mb-2 text-red-600">{error}</div>;

  const visible = data.slice(startIndex, startIndex + perPage);

  const carouselRender = (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className="p-1 rounded-full bg-white border shadow disabled:opacity-30"
        aria-label="Sebelumnya"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M13 15l-5-5 5-5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {visible.map((item) => (
          <div key={item.label} className="min-w-[225px] max-w-[225px] bg-blue-50 rounded-lg p-4 shadow border flex flex-col items-center text-center">
            <div className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2 justify-center">
              <CloudRain className="h-5 w-5 text-blue-600" /> {item.label}
            </div>
            {item.weather && item.main ? (
              <>
                <div className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                  {Math.round(item.main.temp)}°C
                  <Image src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="icon" width={32} height={32} className="inline h-8 w-8" />
                </div>
                <div className="text-sm text-blue-800 capitalize mt-1">{item.weather[0].description}</div>
                <div className="text-xs text-blue-600 mt-2">Kelembapan: {item.main.humidity}% | Angin: {item.wind.speed} m/s</div>
              </>
            ) : (
              <div className="text-red-600 text-xs">{item.error || 'Gagal memuat data'}</div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={startIndex + perPage >= data.length}
        className="p-1 rounded-full bg-white border shadow disabled:opacity-30"
        aria-label="Selanjutnya"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7 5l5 5-5 5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );

  // expose cuacaAlerts ke parent
  return { Carousel: carouselRender, cuacaAlerts };
}

export function GapoktanDashboard() {
  const { user } = useAuth();
  // State untuk summary card
  const [stat, setStat] = useState({
    totalHarvest: 0,
    checklistTotal: 0,
    checklistDone: 0,
    lahanTotal: 0,
    lahanSiapPanen: 0,
    loading: true,
  });
  // State untuk grafik
  const [productivity, setProductivity] = useState<any[]>([]);
  const [harvestTrend, setHarvestTrend] = useState<any[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    if (!user || !user.id) return;
    setStat(s => ({ ...s, loading: true }));
    // Fetch lahan
    fetch(`/api/lahan?gapoktan_id=${user.id}`)
      .then(res => res.json())
      .then(res => {
        const lahan = res.data || [];
        setStat(s => ({ ...s, lahanTotal: lahan.length, lahanSiapPanen: lahan.filter((l: any) => l.status === 'Siap Panen').length }));
      });
    // Fetch checklist/tugas
    api.getTugasByGapoktan(user.id).then(res => {
      const tugas = res.data || [];
      setStat(s => ({ ...s, checklistTotal: tugas.length, checklistDone: tugas.filter((t: any) => t.status === 'Selesai').length }));
    });
    // Fetch panen untuk grafik dan total panen bulan ini
    setLoadingChart(true);
    getPanenByGapoktan(user.id).then(res => {
      const panen = res.data || [];
      // Hitung total panen bulan ini
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const totalHarvestThisMonth = panen
        .filter((p: any) => {
          const panenDate = new Date(p.tanggal);
          return panenDate.getMonth() === currentMonth && panenDate.getFullYear() === currentYear;
        })
        .reduce((acc: number, p: any) => acc + Number(p.jumlah), 0);
      setStat(s => ({ ...s, totalHarvest: totalHarvestThisMonth, loading: false }));
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
  }, [user]);

  // Ganti variabel lama dengan stat dari backend
  const totalHarvest = stat.totalHarvest;
  const completedTasks = stat.checklistDone;
  const totalTasks = stat.checklistTotal;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];
  const now = new Date();
  const tanggal = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  // Gunakan CuacaCarousel sebagai hook agar bisa ambil cuacaAlerts
  const { Carousel: CuacaCarouselView, cuacaAlerts } = (CuacaCarousel as any)();
  // Gabungkan weatherAlerts lokal dan cuacaAlerts dari API
  const allWeatherAlerts = [
    ...weatherAlerts,
    ...(cuacaAlerts || [])
  ];

  const [tugasTerbaru, setTugasTerbaru] = useState<any[]>([]);
  const [laporanTerbaru, setLaporanTerbaru] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.id) {
      // Fetch tugas
      fetch(`/api/tugas/gapoktan/${user.id}`)
        .then(res => res.json())
        .then(res => setTugasTerbaru(res.data?.slice(0, 4) || []));
      // Fetch laporan
      fetch(`/api/laporan/gapoktan/${user.id}`)
        .then(res => res.json())
        .then(res => setLaporanTerbaru(res.data?.slice(0, 4) || []));
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Selamat datang, Gapoktan</h1>
          <p className="text-earth-brown-600">{tanggal} | {jam}</p>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="harvest-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Panen Bulan Ini</CardTitle>
            {/* <Wheat className="h-4 w-4 text-earth-green-600" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-green-700">{stat.loading ? '...' : totalHarvest.toLocaleString()} kg</div>
            <p className="text-xs text-earth-brown-600">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {/* TODO: Hitung persentase kenaikan jika data bulan lalu tersedia */}
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card className="harvest-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peringatan Cuaca</CardTitle>
            <CloudRain className="h-4 w-4 text-earth-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-yellow-700">{weatherAlerts.length}</div>
            <p className="text-xs text-earth-brown-600">
              {weatherAlerts.filter(alert => alert.severity === 'high').length} peringatan tinggi
            </p>
          </CardContent>
        </Card>
        <Card className="harvest-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress Checklist</CardTitle>
            <CheckCircle className="h-4 w-4 text-earth-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-green-700">{stat.loading ? '...' : Math.round(taskProgress)}%</div>
            <Progress value={taskProgress} className="mt-2" />
            <p className="text-xs text-earth-brown-600 mt-1">
              {stat.loading ? '...' : `${completedTasks} dari ${totalTasks} tugas selesai`}
            </p>
          </CardContent>
        </Card>
        <Card className="harvest-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lahan Aktif</CardTitle>
            <MapPin className="h-4 w-4 text-earth-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-green-700">{stat.loading ? '...' : stat.lahanTotal}</div>
            <p className="text-xs text-earth-brown-600">{stat.loading ? '...' : `${stat.lahanSiapPanen} siap panen`}</p>
          </CardContent>
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

      {/* Cuaca Realtime Carousel */}
      {CuacaCarouselView}

      {/* Peringatan Cuaca */}
      <Card className="harvest-card mb-8">
        <CardHeader>
          <CardTitle className="text-earth-brown-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-earth-yellow-600" />
            Peringatan Cuaca Terkini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allWeatherAlerts.length === 0 && (
              <div className="text-sm text-earth-brown-600">Tidak ada peringatan cuaca saat ini.</div>
            )}
            {allWeatherAlerts.map((alert, idx) => (
              <div key={alert.event || alert.id || idx} className="flex items-start gap-3 p-3 bg-earth-yellow-50 rounded-lg border border-earth-yellow-200">
                <AlertTriangle className={`h-5 w-5 mt-0.5 text-earth-yellow-600`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                      {(alert.severity || alert.severity?.toUpperCase() || alert.event || 'ALERT').toString()}
                    </Badge>
                    <span className="text-sm text-earth-brown-600">{alert.location || alert.sender_name || '-'}</span>
                  </div>
                  <p className="text-sm text-earth-brown-800">{alert.description || alert.message}</p>
                  {alert.start && (
                    <p className="text-xs text-earth-brown-600 mt-1">
                      {new Date(alert.start * 1000).toLocaleString('id-ID')}
                      {alert.end ? ' - ' + new Date(alert.end * 1000).toLocaleString('id-ID') : ''}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Bawah: Checklist, Agenda, Laporan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tugas Terdekat */}
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle className="text-earth-brown-800 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-earth-green-600" />
              Tugas Terdekat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tugasTerbaru.length === 0 && <div className="text-sm text-earth-brown-600">Tidak ada tugas.</div>}
              {tugasTerbaru.map((item) => (
                <div key={item.id} className="p-3 bg-earth-green-50 rounded-lg border border-earth-green-200">
                  <h4 className="font-medium text-earth-brown-800">{item.judul}</h4>
                  <p className="text-sm text-earth-brown-600 mt-1">{item.deskripsi}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-earth-brown-600">{item.mulai ? new Date(item.mulai).toLocaleDateString('id-ID') : '-'}</span>
                    <Badge variant="outline">{item.prioritas}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Laporan Terbaru */}
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle className="text-earth-brown-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-earth-green-600" />
              Laporan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {laporanTerbaru.length === 0 && <div className="text-sm text-earth-brown-600">Tidak ada laporan.</div>}
              {laporanTerbaru.map((report) => (
                <div key={report.id} className="p-3 bg-earth-brown-50 rounded-lg border border-earth-brown-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-earth-brown-800">{report.judul_laporan}</h4>
                    <Badge>{report.status_laporan}</Badge>
                  </div>
                  <span className="text-xs text-earth-brown-600">{report.tanggal_laporan ? new Date(report.tanggal_laporan).toLocaleDateString('id-ID') : (report.created_at ? new Date(report.created_at).toLocaleDateString('id-ID') : '-')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getWeekNumber(date: Date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDay.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7);
}