import { WeatherAlert, HarvestData, Field, Task, Report, SystemLog, ChecklistItem, AgendaItem } from '@/types';

export const weatherAlerts: WeatherAlert[] = [
  {
    id: '1',
    type: 'rain',
    severity: 'medium',
    message: 'Hujan lebat diprediksi dalam 24 jam ke depan',
    location: 'Subang, Jawa Barat',
    timestamp: new Date('2024-01-15T10:30:00')
  },
  {
    id: '2',
    type: 'drought',
    severity: 'high',
    message: 'Tingkat kekeringan tinggi, perlu irigasi tambahan',
    location: 'Karawang, Jawa Barat',
    timestamp: new Date('2024-01-15T08:15:00')
  },
  {
    id: '3',
    type: 'storm',
    severity: 'high',
    message: 'Peringatan badai untuk wilayah pegunungan',
    location: 'Bandung, Jawa Barat',
    timestamp: new Date('2024-01-15T06:45:00')
  }
];

export const harvestData: HarvestData[] = [
  {
    id: '1',
    crop: 'Padi',
    quantity: 2500,
    unit: 'kg',
    date: new Date('2024-01-10'),
    location: 'Lahan A1',
    quality: 'A'
  },
  {
    id: '2',
    crop: 'Jagung',
    quantity: 1800,
    unit: 'kg',
    date: new Date('2024-01-12'),
    location: 'Lahan B2',
    quality: 'B'
  },
  {
    id: '3',
    crop: 'Tomat',
    quantity: 950,
    unit: 'kg',
    date: new Date('2024-01-14'),
    location: 'Lahan C3',
    quality: 'A'
  }
];

export const fields: Field[] = [
  {
    id: '1',
    name: 'Lahan Padi Utama',
    area: 2.5,
    crop: 'Padi',
    location: { lat: -6.2088, lng: 106.8456 },
    status: 'active',
    lastUpdated: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Kebun Jagung Timur',
    area: 1.8,
    crop: 'Jagung',
    location: { lat: -6.1944, lng: 106.8229 },
    status: 'harvested',
    lastUpdated: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Greenhouse Tomat',
    area: 0.5,
    crop: 'Tomat',
    location: { lat: -6.2297, lng: 106.8576 },
    status: 'active',
    lastUpdated: new Date('2024-01-14')
  }
];

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Inspeksi Lahan Padi',
    description: 'Pemeriksaan rutin kondisi tanaman padi di lahan utama',
    priority: 'high',
    status: 'pending',
    assignedTo: 'Ahmad Susanto',
    assignedBy: 'Siti Rahayu',
    dueDate: new Date('2024-01-17'),
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Laporan Hasil Panen',
    description: 'Buat laporan detail hasil panen jagung minggu ini',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'Ahmad Susanto',
    assignedBy: 'Siti Rahayu',
    dueDate: new Date('2024-01-20'),
    createdAt: new Date('2024-01-14')
  },
  {
    id: '3',
    title: 'Pelatihan Teknologi Baru',
    description: 'Menghadiri pelatihan penggunaan sensor IoT untuk monitoring tanaman',
    priority: 'low',
    status: 'completed',
    assignedTo: 'Ahmad Susanto',
    assignedBy: 'Budi Hartono',
    dueDate: new Date('2024-01-13'),
    createdAt: new Date('2024-01-10')
  }
];

export const reports: Report[] = [
  {
    id: '1',
    title: 'Laporan Panen Padi Januari',
    type: 'harvest',
    status: 'submitted',
    author: 'Ahmad Susanto',
    location: 'Lahan A1',
    createdAt: new Date('2024-01-14'),
    content: 'Hasil panen padi bulan ini mencapai 2.5 ton dengan kualitas grade A...'
  },
  {
    id: '2',
    title: 'Analisis Kondisi Cuaca',
    type: 'weather',
    status: 'reviewed',
    author: 'Siti Rahayu',
    location: 'Regional Jawa Barat',
    createdAt: new Date('2024-01-13'),
    content: 'Prediksi cuaca menunjukkan pola hujan yang tidak normal...'
  },
  {
    id: '3',
    title: 'Deteksi Hama Tikus',
    type: 'pest',
    status: 'draft',
    author: 'Ahmad Susanto',
    location: 'Lahan B2',
    createdAt: new Date('2024-01-15'),
    content: 'Ditemukan indikasi serangan hama tikus di area penyimpanan...'
  }
];

export const systemLogs: SystemLog[] = [
  {
    id: '1',
    action: 'User Login',
    user: 'Ahmad Susanto',
    timestamp: new Date('2024-01-15T09:30:00'),
    details: 'Successful login from mobile app',
    ip: '192.168.1.100'
  },
  {
    id: '2',
    action: 'Report Submitted',
    user: 'Ahmad Susanto',
    timestamp: new Date('2024-01-15T09:15:00'),
    details: 'Harvest report for Lahan A1 submitted',
    ip: '192.168.1.100'
  },
  {
    id: '3',
    action: 'Task Assigned',
    user: 'Siti Rahayu',
    timestamp: new Date('2024-01-15T08:45:00'),
    details: 'Field inspection task assigned to Ahmad Susanto',
    ip: '192.168.1.50'
  }
];

export const checklistItems: ChecklistItem[] = [
  {
    id: '1',
    task: 'Cek kondisi sistem irigasi',
    completed: true,
    dueDate: new Date('2024-01-15'),
    priority: 'high'
  },
  {
    id: '2',
    task: 'Aplikasi pupuk NPK',
    completed: false,
    dueDate: new Date('2024-01-16'),
    priority: 'medium'
  },
  {
    id: '3',
    task: 'Monitoring pertumbuhan tanaman',
    completed: true,
    dueDate: new Date('2024-01-15'),
    priority: 'high'
  },
  {
    id: '4',
    task: 'Bersihkan saluran air',
    completed: false,
    dueDate: new Date('2024-01-17'),
    priority: 'low'
  }
];

export const agendaItems: AgendaItem[] = [
  {
    id: '1',
    title: 'Rapat Koordinasi Mingguan',
    description: 'Evaluasi progress dan planning untuk minggu depan',
    date: new Date('2024-01-17T10:00:00'),
    type: 'meeting',
    location: 'Kantor Dinas Pertanian'
  },
  {
    id: '2',
    title: 'Inspeksi Lahan Bersama',
    description: 'Kunjungan lapangan bersama tim penyuluh',
    date: new Date('2024-01-18T08:00:00'),
    type: 'inspection',
    location: 'Lahan Padi Utama'
  },
  {
    id: '3',
    title: 'Panen Tomat Greenhouse',
    description: 'Jadwal panen tomat di greenhouse area C',
    date: new Date('2024-01-19T06:00:00'),
    type: 'harvest',
    location: 'Greenhouse Tomat'
  },
  {
    id: '4',
    title: 'Pelatihan Teknologi IoT',
    description: 'Workshop penggunaan sensor monitoring tanaman',
    date: new Date('2024-01-20T14:00:00'),
    type: 'training',
    location: 'Balai Pelatihan Pertanian'
  }
];

export const productivityData = [
  { week: 'Minggu 1', padi: 2400, jagung: 1800, tomat: 900 },
  { week: 'Minggu 2', padi: 2600, jagung: 2100, tomat: 950 },
  { week: 'Minggu 3', padi: 2200, jagung: 1900, tomat: 800 },
  { week: 'Minggu 4', padi: 2800, jagung: 2300, tomat: 1100 },
];

export const harvestTrendData = [
  { month: 'Sep', harvest: 8500 },
  { month: 'Oct', harvest: 9200 },
  { month: 'Nov', harvest: 8800 },
  { month: 'Dec', harvest: 9800 },
  { month: 'Jan', harvest: 10200 },
];

export const regionalPerformanceData = [
  { region: 'Subang', performance: 85, target: 90 },
  { region: 'Karawang', performance: 92, target: 90 },
  { region: 'Bekasi', performance: 78, target: 85 },
  { region: 'Bogor', performance: 88, target: 90 },
];