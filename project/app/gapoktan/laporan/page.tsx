'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Search, Filter, Download, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import * as api from '@/lib/api';
import { useEffect } from 'react';

export default function LaporanPage() {
  const { user, loading } = useAuth();
  const [laporan, setLaporan] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'Belum Divalidasi' | 'Valid' | 'Perlu Revisi'>('all');
  const [notif, setNotif] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.id) {
      api.getLaporanByGapoktan(user.id)
        .then(res => setLaporan(res.data || []))
        .catch(() => setLaporan([]));
    }
  }, [user]);

  const filteredLaporan = laporan.filter(lap => {
    if (filter === 'all') return true;
    return lap.status_laporan === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Belum Divalidasi': return 'bg-blue-100 text-blue-800';
      case 'Valid': return 'bg-green-100 text-green-800';
      case 'Perlu Revisi': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Dummy type color, bisa diubah jika ada field jenis laporan
  const getTypeColor = () => 'bg-green-100 text-green-800';

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-earth-brown-800">Laporan</h1>
            <p className="text-earth-brown-600 mt-1">Kelola laporan lapangan dan dokumentasi</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-earth-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-earth-green-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Total Laporan</p>
                  <p className="text-2xl font-bold text-earth-brown-800">{laporan.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Draft</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {laporan.filter(l => l.status_laporan === 'draft').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Submitted</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {laporan.filter(l => l.status_laporan === 'Belum Divalidasi').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Reviewed</p>
                  <p className="text-2xl font-bold text-earth-brown-800">
                    {laporan.filter(l => l.status_laporan === 'Valid').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Daftar Laporan</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Filters */}
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'Semua', count: laporan.length },
                { key: 'Belum Divalidasi', label: 'Belum Divalidasi', count: laporan.filter(l => l.status_laporan === 'Belum Divalidasi').length },
                { key: 'Valid', label: 'Valid', count: laporan.filter(l => l.status_laporan === 'Valid').length },
                { key: 'Perlu Revisi', label: 'Perlu Revisi', count: laporan.filter(l => l.status_laporan === 'Perlu Revisi').length }
              ].map((filterOption) => (
                <Button
                  key={filterOption.key}
                  variant={filter === filterOption.key ? 'default' : 'outline'}
                  onClick={() => setFilter(filterOption.key as any)}
                  className={filter === filterOption.key ? 'bg-earth-green-600 hover:bg-earth-green-700' : ''}
                >
                  {filterOption.label} ({filterOption.count})
                </Button>
              ))}
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredLaporan.map((lap) => (
                <Card key={lap.id} className="harvest-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-earth-brown-800">{lap.judul_laporan}</h3>
                          <Badge className={getTypeColor()}>
                            Laporan
                          </Badge>
                          <Badge className={getStatusColor(lap.status_laporan)}>
                            {lap.status_laporan}
                          </Badge>
                        </div>
                        <p className="text-sm text-earth-brown-600 mb-3">
                          {lap.isi_laporan?.substring(0, 150)}...
                        </p>
                        <div className="flex items-center gap-4 text-sm text-earth-brown-600">
                          <span>Tanggal: {lap.tanggal_laporan}</span>
                          {lap.lampiran && (
                            <a href={lap.lampiran} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lampiran</a>
                          )}
                        </div>
                        {lap.catatan_penyuluh && (
                          <div className="mt-2 text-xs text-yellow-700 bg-yellow-50 rounded p-2">Catatan Penyuluh: {lap.catatan_penyuluh}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={lap.lampiran} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TabsContent value="analytics" di-nonaktifkan karena data laporan real tidak punya field jenis/type */}

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="harvest-card">
                <CardHeader>
                  <CardTitle className="text-earth-brown-800">Status Laporan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Belum Divalidasi', 'Valid', 'Perlu Revisi'].map((status) => {
                      const count = laporan.filter(l => l.status_laporan === status).length;
                      const percentage = (laporan.length > 0) ? (count / laporan.length) * 100 : 0;
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-earth-brown-800 capitalize">{status}</span>
                            <span className="text-sm text-earth-brown-600">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-earth-brown-200 rounded-full h-2">
                            <div 
                              className="bg-earth-green-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}