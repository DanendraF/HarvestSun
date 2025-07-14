import { useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useMapEvents } from "react-leaflet";
import L from "leaflet";

// Override default marker icon agar tidak error 404
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

interface MapInputProps {
  value: string;
  onChange: (alamat: string) => void;
  latLng: { lat: number; lng: number } | null;
  onLatLngChange: (latLng: { lat: number; lng: number }) => void;
}

function MapClickHandler({ onMapClick }: { onMapClick: (e: any) => void }) {
  useMapEvents({ click: onMapClick });
  return null;
}

export default function MapInput({ value, onChange, latLng, onLatLngChange }: MapInputProps) {
  const [loading, setLoading] = useState(false);

  async function reverseGeocode(lat: number, lng: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lng}`);
      const data = await res.json();
      onChange(data.display_name || `${lat}, ${lng}`);
    } catch {
      onChange(`${lat}, ${lng}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleMapClick(e: any) {
    const { lat, lng } = e.latlng;
    onLatLngChange({ lat, lng });
    await reverseGeocode(lat, lng);
  }

  return (
    <div>
      <div className="h-48 w-full rounded overflow-hidden mb-2">
        <MapContainer
          center={latLng || [-7.8014, 110.3647]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <MapClickHandler onMapClick={handleMapClick} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {latLng && <Marker position={[latLng.lat, latLng.lng]} />}
        </MapContainer>
      </div>
      <label className="block mb-1 font-medium">Alamat (otomatis dari peta, bisa diedit)</label>
      <input
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        disabled={loading}
        placeholder="Klik peta untuk memilih lokasi"
      />
    </div>
  );
} 