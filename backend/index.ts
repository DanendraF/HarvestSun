import express from 'express';
import authRouter from './routes/auth';
import { supabase } from './services/auth';
import dotenv from 'dotenv';
import cors from 'cors';
import tugasRouter from './routes/tugas';
import gapoktanRouter from './routes/gapoktan';
import laporanRouter from './routes/laporan';
import cuacaRouter from './routes/cuaca';
import lahanRouter from './routes/lahan';
import panenRouter from './routes/panen';

import reverseGeocodeRouter from './routes/reverseGeocode';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://harvestsun.vercel.app', // ganti dengan domain Vercel kamu
  credentials: true
}));
app.use(express.json());

// Route auth
app.use('/api/auth', authRouter);
// Route tugas
app.use('/api/tugas', tugasRouter);
app.use('/api/gapoktan', gapoktanRouter);
app.use('/api/laporan', laporanRouter);
app.use('/api/lahan', lahanRouter);
app.use('/api/reverse-geocode', reverseGeocodeRouter);
app.use('/api', cuacaRouter);
app.use('/api/panen', panenRouter);

async function testSupabaseConnection() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('Koneksi ke Supabase GAGAL:', error.message);
  } else {
    console.log('Koneksi ke Supabase BERHASIL! Hello Big F 🧑‍💻');
  }
}

// Panggil fungsi ini sekali saat server start
testSupabaseConnection();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
}); 

//
//