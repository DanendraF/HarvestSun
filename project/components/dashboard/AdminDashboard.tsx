'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Users,
  Activity,
  Database,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Server
} from 'lucide-react';
import { systemLogs, reports, harvestTrendData } from '@/data/sampleData';

export function AdminDashboard() {
  const totalUsers = 45;
  const activeUsers = 38;
  const totalReports = reports.length;
  const systemHealth = 98.5;

  const userRoleData = [
    { name: 'Gapoktan', value: 25, color: '#22c55e' },
    { name: 'Penyuluh', value: 12, color: '#eab308' },
    { name: 'Admin', value: 8, color: '#f97316' }
  ];

  const systemMetrics = [
    { name: 'CPU Usage', value: 45, color: '#22c55e' },
    { name: 'Memory', value: 62, color: '#eab308' },
    { name: 'Storage', value: 78, color: '#f97316' },
    { name: 'Network', value: 35, color: '#22c55e' }
  ];

  const reportStatusData = [
    { name: 'Draft', value: reports.filter(r => r.status === 'draft').length, color: '#f97316' },
    { name: 'Submitted', value: reports.filter(r => r.status === 'submitted').length, color: '#eab308' },
    { name: 'Reviewed', value: reports.filter(r => r.status === 'reviewed').length, color: '#22c55e' }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="harvest-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-earth-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-green-700">{totalUsers}</div>
            <p className="text-xs text-earth-brown-600">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {activeUsers} aktif
            </p>
          </CardContent>
        </Card>

        <Card className="harvest-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kesehatan Sistem</CardTitle>
            <Server className="h-4 w-4 text-earth-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-green-700">{systemHealth}%</div>
            <Progress value={systemHealth} className="mt-2" />
            <p className="text-xs text-earth-brown-600 mt-1">
              <CheckCircle className="h-3 w-3 inline mr-1" />
              Status Normal
            </p>
          </CardContent>
        </Card>

        <Card className="harvest-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
            <Database className="h-4 w-4 text-earth-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-green-700">{totalReports}</div>
            <p className="text-xs text-earth-brown-600">
              Bulan ini
            </p>
          </CardContent>
        </Card>

        <Card className="harvest-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktivitas Harian</CardTitle>
            <Activity className="h-4 w-4 text-earth-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-green-700">{systemLogs.length}</div>
            <p className="text-xs text-earth-brown-600">Log entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle className="text-earth-brown-800">Distribusi Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="harvest-card">
          <CardHeader>
            <CardTitle className="text-earth-brown-800">Status Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <Card className="harvest-card">
        <CardHeader>
          <CardTitle className="text-earth-brown-800">Metrik Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemMetrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-earth-brown-800">{metric.name}</span>
                  <span className="text-sm text-earth-brown-600">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle className="text-earth-brown-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-earth-green-600" />
              Log Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-earth-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-earth-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-earth-brown-800">{log.action}</p>
                    <p className="text-sm text-earth-brown-600">{log.user}</p>
                    <p className="text-xs text-earth-brown-500 mt-1">
                      {log.timestamp.toLocaleString('id-ID')} • {log.ip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="harvest-card">
          <CardHeader>
            <CardTitle className="text-earth-brown-800">Tren Data Platform</CardTitle>
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

      {/* Quick Actions */}
      <Card className="harvest-card">
        <CardHeader>
          <CardTitle className="text-earth-brown-800">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-earth-green-100 hover:bg-earth-green-200 rounded-lg text-left transition-colors">
              <Users className="h-6 w-6 text-earth-green-600 mb-2" />
              <h3 className="font-medium text-earth-brown-800">Kelola Pengguna</h3>
              <p className="text-sm text-earth-brown-600">Tambah atau edit pengguna</p>
            </button>
            <button className="p-4 bg-earth-yellow-100 hover:bg-earth-yellow-200 rounded-lg text-left transition-colors">
              <Shield className="h-6 w-6 text-earth-yellow-600 mb-2" />
              <h3 className="font-medium text-earth-brown-800">Roles & Permissions</h3>
              <p className="text-sm text-earth-brown-600">Atur hak akses</p>
            </button>
            <button className="p-4 bg-earth-brown-100 hover:bg-earth-brown-200 rounded-lg text-left transition-colors">
              <Database className="h-6 w-6 text-earth-brown-600 mb-2" />
              <h3 className="font-medium text-earth-brown-800">Backup Data</h3>
              <p className="text-sm text-earth-brown-600">Cadangkan database</p>
            </button>
            <button className="p-4 bg-red-100 hover:bg-red-200 rounded-lg text-left transition-colors">
              <AlertTriangle className="h-6 w-6 text-red-600 mb-2" />
              <h3 className="font-medium text-earth-brown-800">System Alerts</h3>
              <p className="text-sm text-earth-brown-600">Peringatan sistem</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}