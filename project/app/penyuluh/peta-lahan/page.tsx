'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, MapPin, Plus, Layers, Satellite, Navigation } from 'lucide-react';
import { fields } from '@/data/sampleData';
import { useAuth } from '@/hooks/useAuth';

export default function PetaLahanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [mapView, setMapView] = useState<'satellite' | 'street' | 'terrain'>('satellite');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'penyuluh') {
        // Redirect ke dashboard sesuai role
        if (user.role === 'gapoktan') router.push('/gapoktan/dashboard');
        else if (user.role === 'admin') router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'penyuluh') return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'harvested': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalArea = fields.reduce((acc, field) => acc + field.area, 0);
  const activeFields = fields.filter(field => field.status === 'active').length;

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-earth-brown-800">Peta Lahan</h1>
            <p className="text-earth-brown-600 mt-1">Kelola dan pantau lahan pertanian</p>
          </div>
          <Button className="bg-earth-green-600 hover:bg-earth-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Lahan
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-earth-green-100 rounded-lg">
                  <Map className="h-5 w-5 text-earth-green-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Total Lahan</p>
                  <p className="text-2xl font-bold text-earth-brown-800">{fields.length}</p>
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
                  <p className="text-sm text-earth-brown-600">Lahan Aktif</p>
                  <p className="text-2xl font-bold text-earth-brown-800">{activeFields}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-earth-yellow-100 rounded-lg">
                  <Layers className="h-5 w-5 text-earth-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Total Area</p>
                  <p className="text-2xl font-bold text-earth-brown-800">{totalArea} Ha</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="harvest-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Satellite className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-earth-brown-600">Monitoring</p>
                  <p className="text-2xl font-bold text-earth-brown-800">Real-time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map View */}
          <Card className="lg:col-span-2 harvest-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-earth-brown-800 flex items-center gap-2">
                  <Map className="h-5 w-5 text-earth-green-600" />
                  Peta Interaktif
                </CardTitle>
                <div className="flex gap-2">
                  {[
                    { key: 'satellite', label: 'Satelit', icon: Satellite },
                    { key: 'street', label: 'Jalan', icon: Navigation },
                    { key: 'terrain', label: 'Terrain', icon: Layers }
                  ].map((view) => (
                    <Button
                      key={view.key}
                      variant={mapView === view.key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMapView(view.key as 'satellite' | 'street' | 'terrain')}
                      className={mapView === view.key ? 'bg-earth-green-600 hover:bg-earth-green-700' : ''}
                    >
                      <view.icon className="h-4 w-4 mr-1" />
                      {view.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-earth-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Simulated Map */}
                <div className="absolute inset-0 bg-gradient-to-br from-earth-green-200 to-earth-green-300">
                  <div className="absolute top-1/4 left-1/4 w-16 h-12 bg-earth-green-600 rounded opacity-80"></div>
                  <div className="absolute top-1/2 right-1/3 w-20 h-16 bg-earth-yellow-600 rounded opacity-80"></div>
                  <div className="absolute bottom-1/3 left-1/2 w-12 h-10 bg-earth-green-700 rounded opacity-80"></div>
                  
                  {/* Field markers */}
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all ${
                        selectedField === field.id ? 'ring-2 ring-white' : ''
                      } ${
                        field.status === 'active' ? 'bg-green-500' :
                        field.status === 'harvested' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{
                        top: `${20 + (index * 20)}%`,
                        left: `${30 + (index * 15)}%`
                      }}
                      onClick={() => setSelectedField(field.id)}
                    />
                  ))}
                </div>
                
                <div className="text-center z-10">
                  <Map className="h-12 w-12 text-earth-green-600 mx-auto mb-2" />
                  <p className="text-earth-brown-600">
                    Peta interaktif dengan data real-time
                  </p>
                  <p className="text-sm text-earth-brown-500 mt-1">
                    Klik marker untuk detail lahan
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field List */}
          <Card className="harvest-card">
            <CardHeader>
              <CardTitle className="text-earth-brown-800">Daftar Lahan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedField === field.id 
                        ? 'border-earth-green-500 bg-earth-green-50' 
                        : 'border-earth-brown-200 hover:border-earth-green-300'
                    }`}
                    onClick={() => setSelectedField(field.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-earth-brown-800 text-sm">{field.name}</h3>
                        <p className="text-xs text-earth-brown-600 mt-1">{field.crop}</p>
                        <p className="text-xs text-earth-brown-600">{field.area} Ha</p>
                      </div>
                      <Badge className={getStatusColor(field.status)}>
                        {field.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Field Details */}
        {selectedField && (
          <Card className="harvest-card mt-6">
            <CardHeader>
              <CardTitle className="text-earth-brown-800">Detail Lahan</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const field = fields.find(f => f.id === selectedField);
                if (!field) return null;
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <h4 className="font-medium text-earth-brown-800 mb-2">Informasi Dasar</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Nama:</span> {field.name}</p>
                        <p><span className="font-medium">Tanaman:</span> {field.crop}</p>
                        <p><span className="font-medium">Luas:</span> {field.area} Ha</p>
                        <p><span className="font-medium">Status:</span> 
                          <Badge className={`ml-2 ${getStatusColor(field.status)}`}>
                            {field.status}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-earth-brown-800 mb-2">Koordinat</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Latitude:</span> {field.location.lat}</p>
                        <p><span className="font-medium">Longitude:</span> {field.location.lng}</p>
                        <p><span className="font-medium">Update:</span> {field.lastUpdated.toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-earth-brown-800 mb-2">Monitoring</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Sensor:</span> Aktif</p>
                        <p><span className="font-medium">Kelembaban:</span> 75%</p>
                        <p><span className="font-medium">Suhu:</span> 28°C</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-earth-brown-800 mb-2">Aksi</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full">
                          Edit Lahan
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          Lihat Riwayat
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          Generate Laporan
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}