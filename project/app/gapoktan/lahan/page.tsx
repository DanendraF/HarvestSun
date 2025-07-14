"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Edit, Trash2, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import dynamic from "next/dynamic";

const MapInput = dynamic(
  () => import('@/components/maps/MapInput').then(mod => mod.default),
  { ssr: false }
);
import "leaflet/dist/leaflet.css";
// import "next-leaflet-cluster/assets/MarkerCluster.css";
// import "next-leaflet-cluster/assets/MarkerCluster.Default.css";
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

const KOMODITAS = ["Padi", "Jagung", "Kedelai", "Cabai", "Tomat"];

export default function LahanPage() {
  const { user } = useAuth();
  const [lahan, setLahan] = useState<any[]>([]);
  const [form, setForm] = useState({ nama: "", lokasi: "", luas: "", komoditas: "" });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ nama: "", lokasi: "", luas: "", komoditas: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [editLatLng, setEditLatLng] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch lahan dari backend
  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/lahan?gapoktan_id=${user.id}`)
      .then(res => res.json())
      .then(res => setLahan(res.data || []));
  }, [user]);

  if (!user) return null;
  // Setelah ini, user pasti tidak null

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.nama || !form.lokasi || !form.luas || !form.komoditas) return;
    if (!latLng) {
      alert("Silakan pilih lokasi di peta");
      setLoading(false);
      return;
    }
    setLoading(true);
    await fetch("/api/lahan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gapoktan_id: user!.id,
        nama: form.nama,
        lokasi: form.lokasi,
        luas: parseFloat(form.luas),
        komoditas: form.komoditas,
        latitude: latLng.lat,
        longitude: latLng.lng,
      }),
    });
    setForm({ nama: "", lokasi: "", luas: "", komoditas: "" });
    setLatLng(null);
    await refreshLahan();
    setLoading(false);
    setShowAddModal(false);
  }

  async function refreshLahan() {
    const res = await fetch(`/api/lahan?gapoktan_id=${user!.id}`);
    const data = await res.json();
    setLahan(data.data || []);
  }

  // Fungsi reverse geocode
  async function reverseGeocode(lat: number, lng: number) {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    return data.display_name || `${lat}, ${lng}`;
  }

  // Handler klik peta tambah lahan
  async function handleMapClick(e: any) {
    const { lat, lng } = e.latlng;
    setLatLng({ lat, lng });
    const alamat = await reverseGeocode(lat, lng);
    setForm(f => ({ ...f, lokasi: alamat }));
  }
  // Handler klik peta edit lahan
  async function handleEditMapClick(e: any) {
    const { lat, lng } = e.latlng;
    setEditLatLng({ lat, lng });
    const alamat = await reverseGeocode(lat, lng);
    setEditForm(f => ({ ...f, lokasi: alamat }));
  }

  // Edit
  function openEditModal(l: any) {
    setEditId(l.id);
    setEditForm({ nama: l.nama, lokasi: l.lokasi, luas: l.luas.toString(), komoditas: l.komoditas });
    setEditLatLng(l.latitude && l.longitude ? { lat: l.latitude, lng: l.longitude } : null);
    setShowEditModal(true);
  }
  function handleEditChange(e: any) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }
  async function handleEditSubmit(e: any) {
    e.preventDefault();
    if (!editId) return;
    if (!editLatLng) {
      alert("Silakan pilih lokasi di peta");
      setLoading(false);
      return;
    }
    setLoading(true);
    await fetch(`/api/lahan/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama: editForm.nama,
        lokasi: editForm.lokasi,
        luas: parseFloat(editForm.luas),
        komoditas: editForm.komoditas,
        latitude: editLatLng.lat,
        longitude: editLatLng.lng,
      }),
    });
    setShowEditModal(false);
    setEditId(null);
    setEditForm({ nama: "", lokasi: "", luas: "", komoditas: "" });
    setEditLatLng(null);
    await refreshLahan();
    setLoading(false);
  }

  // Hapus
  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus lahan ini?")) return;
    setLoading(true);
    await fetch(`/api/lahan/${id}`, { method: "DELETE" });
    await refreshLahan();
    setLoading(false);
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Daftar Lahan</h1>
          <Button onClick={() => setShowAddModal(true)} className="bg-earth-green-600 hover:bg-earth-green-700 text-white font-semibold">
            <Plus className="h-5 w-5 mr-2" /> Tambah Lahan
          </Button>
        </div>
        {/* Modal Tambah Lahan */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Tambah Lahan</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <MapInput
                  value={form.lokasi}
                  onChange={alamat => setForm(f => ({ ...f, lokasi: alamat }))}
                  latLng={latLng}
                  onLatLngChange={setLatLng}
                />
                <div>
                  <label className="block mb-1 font-medium">Nama Lahan</label>
                  <Input name="nama" value={form.nama} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Luas (ha)</label>
                  <Input name="luas" type="number" min="0" step="0.01" value={form.luas} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Komoditas</label>
                  <select name="komoditas" value={form.komoditas} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                    <option value="">Pilih Komoditas</option>
                    {KOMODITAS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Batal</Button>
                  <Button type="submit" disabled={loading}>{loading ? "Menambahkan..." : "Tambah"}</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Daftar Lahan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lahan.length === 0 && <div className="text-sm text-earth-brown-600">Belum ada lahan.</div>}
              {lahan.map((l) => (
                <div key={l.id} className="p-4 bg-green-50 rounded-lg border border-green-200 flex flex-col gap-1 min-w-[350px] w-full">
                  <div className="font-semibold text-earth-green-700">{l.nama}</div>
                  <div className="text-sm text-earth-brown-700">{l.lokasi}</div>
                  <div className="text-xs text-earth-brown-600">Luas: {l.luas} ha</div>
                  <div className="text-xs text-earth-brown-600">Komoditas: {l.komoditas}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(l)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(l.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section Peta Lahan hanya tampil jika modal tambah/edit tidak dibuka */}
        {!(showAddModal || showEditModal) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-earth-green-600" /> Peta Lahan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full rounded-lg overflow-hidden">
                <MapContainer
                  key={`main-${showAddModal}-${showEditModal}-${lahan.length}`}
                  center={lahan.length > 0 && lahan[0].latitude && lahan[0].longitude ? [lahan[0].latitude, lahan[0].longitude] : [-7.8014, 110.3647]}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {lahan.filter(l => l.latitude && l.longitude).map((l, idx) => (
                    <Marker key={l.id || idx} position={[l.latitude, l.longitude]}>
                      <Popup>
                        <div>
                          <div className="font-semibold">{l.nama}</div>
                          <div className="text-xs text-gray-600">{l.lokasi}</div>
                          <div className="text-xs">Luas: {l.luas} ha</div>
                          <div className="text-xs">Komoditas: {l.komoditas}</div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Lahan</h3>
              <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4">
                <MapInput
                  value={editForm.lokasi}
                  onChange={alamat => setEditForm(f => ({ ...f, lokasi: alamat }))}
                  latLng={editLatLng}
                  onLatLngChange={setEditLatLng}
                />
                <div>
                  <label className="block mb-1 font-medium">Nama Lahan</label>
                  <Input name="nama" value={editForm.nama} onChange={handleEditChange} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Luas (ha)</label>
                  <Input name="luas" type="number" min="0" step="0.01" value={editForm.luas} onChange={handleEditChange} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Komoditas</label>
                  <select name="komoditas" value={editForm.komoditas} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required>
                    <option value="">Pilih Komoditas</option>
                    {KOMODITAS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Batal</Button>
                  <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 