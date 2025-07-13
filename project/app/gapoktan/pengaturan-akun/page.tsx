'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { User, Settings, Shield, Bell, Key } from 'lucide-react';

export default function PengaturanAkunPage() {
  const { user, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-earth-brown-800">Pengaturan Akun</h1>
          <p className="text-earth-brown-600 mt-1">Kelola profil dan preferensi akun Anda</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Keamanan
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifikasi
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferensi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="harvest-card">
              <CardHeader>
                <CardTitle className="text-earth-brown-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-earth-green-600" />
                  Informasi Profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-earth-green-100 flex items-center justify-center">
                    <User className="h-10 w-10 text-earth-green-600" />
                  </div>
                  <div>
                    <Button variant="outline">Upload Foto</Button>
                    <p className="text-sm text-earth-brown-600 mt-1">
                      JPG, PNG atau GIF. Maksimal 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input id="phone" defaultValue={user.phone || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Wilayah</Label>
                    <Input id="region" defaultValue={user.region || ''} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="flex items-center gap-4">
                    <Input id="role" value={user.role.replace('_', ' ')} readOnly className="capitalize" />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const roles = ['gapoktan', 'penyuluh', 'admin'];
                        const currentIndex = roles.indexOf(user.role);
                        const nextRole = roles[(currentIndex + 1) % roles.length];
                        switchRole(nextRole as any);
                      }}
                    >
                      Switch Role (Demo)
                    </Button>
                  </div>
                </div>

                <Button className="bg-earth-green-600 hover:bg-earth-green-700">
                  Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="harvest-card">
              <CardHeader>
                <CardTitle className="text-earth-brown-800 flex items-center gap-2">
                  <Key className="h-5 w-5 text-earth-green-600" />
                  Ubah Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Password Saat Ini</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Password Baru</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>

                <Button className="bg-earth-green-600 hover:bg-earth-green-700">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="harvest-card">
              <CardHeader>
                <CardTitle className="text-earth-brown-800 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-earth-green-600" />
                  Keamanan Akun
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-earth-brown-800">Two-Factor Authentication</h4>
                    <p className="text-sm text-earth-brown-600">Tingkatkan keamanan dengan 2FA</p>
                  </div>
                  <Button variant="outline">Setup 2FA</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-earth-brown-800">Login Sessions</h4>
                    <p className="text-sm text-earth-brown-600">Kelola session aktif</p>
                  </div>
                  <Button variant="outline">Lihat Sessions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="harvest-card">
              <CardHeader>
                <CardTitle className="text-earth-brown-800 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-earth-green-600" />
                  Pengaturan Notifikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { id: 'weather', label: 'Peringatan Cuaca', description: 'Notifikasi cuaca ekstrem' },
                    { id: 'harvest', label: 'Jadwal Panen', description: 'Pengingat waktu panen' },
                    { id: 'tasks', label: 'Tugas Baru', description: 'Notifikasi tugas yang diberikan' },
                    { id: 'reports', label: 'Laporan', description: 'Update status laporan' },
                  ].map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-earth-brown-800">{notification.label}</h4>
                        <p className="text-sm text-earth-brown-600">{notification.description}</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-earth-green-600 rounded border-earth-brown-300"
                      />
                    </div>
                  ))}
                </div>

                <Button className="bg-earth-green-600 hover:bg-earth-green-700">
                  Simpan Pengaturan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="harvest-card">
              <CardHeader>
                <CardTitle className="text-earth-brown-800 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-earth-green-600" />
                  Preferensi Aplikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-earth-brown-800">Bahasa</h4>
                      <p className="text-sm text-earth-brown-600">Pilih bahasa interface</p>
                    </div>
                    <select className="border border-earth-brown-300 rounded-md px-3 py-2">
                      <option value="id">Bahasa Indonesia</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-earth-brown-800">Zona Waktu</h4>
                      <p className="text-sm text-earth-brown-600">Pengaturan zona waktu</p>
                    </div>
                    <select className="border border-earth-brown-300 rounded-md px-3 py-2">
                      <option value="Asia/Jakarta">WIB (Jakarta)</option>
                      <option value="Asia/Makassar">WITA (Makassar)</option>
                      <option value="Asia/Jayapura">WIT (Jayapura)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-earth-brown-800">Mode Gelap</h4>
                      <p className="text-sm text-earth-brown-600">Tema gelap untuk interface</p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-earth-green-600 rounded border-earth-brown-300"
                    />
                  </div>
                </div>

                <Button className="bg-earth-green-600 hover:bg-earth-green-700">
                  Simpan Preferensi
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}