'use client';

import { useState } from 'react';
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
import { harvestData, weatherAlerts, productivityData, harvestTrendData, checklistItems, agendaItems, reports } from '@/data/sampleData';

export function GapoktanDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const totalHarvest = harvestData.reduce((acc, item) => acc + item.quantity, 0);
  const completedTasks = checklistItems.filter(item => item.completed).length;
  const totalTasks = checklistItems.length;
  const taskProgress = (completedTasks / totalTasks) * 100;
  const COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];
  const now = new Date();
  const tanggal = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

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
            <Wheat className="h-4 w-4 text-earth-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-green-700">{totalHarvest.toLocaleString()} kg</div>
            <p className="text-xs text-earth-brown-600">
              <TrendingUp className="h-3 w-3 inline mr-1" />
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
            <div className="text-2xl font-bold text-earth-green-700">{Math.round(taskProgress)}%</div>
            <Progress value={taskProgress} className="mt-2" />
            <p className="text-xs text-earth-brown-600 mt-1">
              {completedTasks} dari {totalTasks} tugas selesai
            </p>
          </CardContent>
        </Card>
        <Card className="harvest-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lahan Aktif</CardTitle>
            <MapPin className="h-4 w-4 text-earth-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-green-700">3</div>
            <p className="text-xs text-earth-brown-600">2 siap panen</p>
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
            {weatherAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-earth-yellow-50 rounded-lg border border-earth-yellow-200">
                <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                  alert.severity === 'high' ? 'text-red-500' : 
                  alert.severity === 'medium' ? 'text-earth-yellow-600' : 'text-earth-green-600'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-earth-brown-600">{alert.location}</span>
                  </div>
                  <p className="text-sm text-earth-brown-800">{alert.message}</p>
                  <p className="text-xs text-earth-brown-600 mt-1">
                    {alert.timestamp.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section Bawah: Checklist, Agenda, Laporan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Checklist */}
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle className="text-earth-brown-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-earth-green-600" />
              Checklist Mingguan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    readOnly
                    className="h-4 w-4 text-earth-green-600 rounded border-earth-brown-300"
                  />
                  <div className="flex-1">
                    <p className={`text-sm ${item.completed ? 'line-through text-earth-brown-500' : 'text-earth-brown-800'}`}>{item.task}</p>
                    <p className="text-xs text-earth-brown-600">Due: {item.dueDate.toLocaleDateString('id-ID')}</p>
                  </div>
                  <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'secondary' : 'outline'}>{item.priority}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Agenda */}
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle className="text-earth-brown-800 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-earth-green-600" />
              Agenda Terdekat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agendaItems.slice(0, 4).map((item) => (
                <div key={item.id} className="p-3 bg-earth-green-50 rounded-lg border border-earth-green-200">
                  <h4 className="font-medium text-earth-brown-800">{item.title}</h4>
                  <p className="text-sm text-earth-brown-600 mt-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-earth-brown-600">{item.date.toLocaleDateString('id-ID')}</span>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Reports Inbox */}
        <Card className="harvest-card">
          <CardHeader>
            <CardTitle className="text-earth-brown-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-earth-green-600" />
              Laporan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.slice(0, 4).map((report) => (
                <div key={report.id} className="p-3 bg-earth-brown-50 rounded-lg border border-earth-brown-200">
                  <h4 className="font-medium text-earth-brown-800">{report.title}</h4>
                  <p className="text-sm text-earth-brown-600 mt-1">{report.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-earth-brown-600">{report.createdAt.toLocaleDateString('id-ID')}</span>
                    <Badge variant={report.status === 'submitted' ? 'default' : report.status === 'reviewed' ? 'secondary' : 'outline'}>{report.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}