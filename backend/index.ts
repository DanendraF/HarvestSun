import express from 'express';
import authRouter from './routes/auth';
import { supabase } from './services/auth';
import dotenv from 'dotenv';
import cors from 'cors';
import tugasRouter from './routes/tugas';
import gapoktanRouter from './routes/gapoktan';
import laporanRouter from './routes/laporan';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Route auth
app.use('/api/auth', authRouter);
// Route tugas
app.use('/api/tugas', tugasRouter);
app.use('/api/gapoktan', gapoktanRouter);
app.use('/api/laporan', laporanRouter);

async function testSupabaseConnection() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('Koneksi ke Supabase GAGAL:', error.message);
  } else {
    console.log('Koneksi ke Supabase BERHASIL! Contoh data: Hello Big D', data);
  }
}

// Panggil fungsi ini sekali saat server start
testSupabaseConnection();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
}); 