import express from 'express';
import axios from 'axios';

const router = express.Router();
const API_KEY = process.env.OPENWEATHER_API_KEY;

const KOTA_COORDS: Record<string, { lat: number; lon: number }> = {
  'Yogyakarta': { lat: -7.797068, lon: 110.370529 },
  'Sleman': { lat: -7.717304, lon: 110.357018 },
  'Bantul': { lat: -7.887110, lon: 110.328941 },
  'Kulon Progo': { lat: -7.850600, lon: 110.163600 },
  'Gunungkidul': { lat: -7.966620, lon: 110.606674 },
  'Wates': { lat: -7.850600, lon: 110.163600 }, // alias Kulon Progo
  'Wonosari': { lat: -7.966620, lon: 110.606674 }, // alias Gunungkidul
};

router.get('/', async (req, res) => {
  const { kota } = req.query;
  if (!kota) return res.status(400).json({ error: 'Parameter kota wajib diisi' });
  const kotaStr = String(kota);
  const coords = KOTA_COORDS[kotaStr];
  try {
    if (coords) {
      // Coba One Call API 3.0
      try {
        const url3 = `https://api.openweathermap.org/data/3.0/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric&lang=id`;
        const response3 = await axios.get(url3);
        const { current, alerts } = response3.data;
        return res.json({ ...current, alerts: alerts || [] });
      } catch (err3) {
        // Fallback ke One Call API 2.5
        try {
          const url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric&lang=id`;
          const response2 = await axios.get(url2);
          const { current, alerts } = response2.data;
          return res.json({ ...current, alerts: alerts || [] });
        } catch (err2: any) {
          // Jika gagal, log error dan fallback ke endpoint lama
          console.error('CUACA ERROR:', err2?.response?.data || err2.message || err2);
        }
      }
    }
    // Fallback: pakai endpoint lama
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${kotaStr},ID&appid=${API_KEY}&units=metric&lang=id`
    );
    res.json(response.data);
  } catch (err: any) {
    console.error('CUACA ERROR:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Gagal mengambil data cuaca', detail: err?.response?.data || err.message || err });
  }
});

export default router; 