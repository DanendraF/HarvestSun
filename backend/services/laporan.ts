import { supabase } from './auth';

export async function createLaporan(data: any) {
  const { error, data: inserted } = await supabase
    .from('laporan')
    .insert([data])
    .select();
  if (error) throw new Error(error.message);
  return inserted[0];
}

export async function getLaporan() {
  const { data, error } = await supabase
    .from('laporan')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getLaporanByGapoktan(gapoktan_id: string) {
  const { data, error } = await supabase
    .from('laporan')
    .select('*')
    .eq('gapoktan_id', gapoktan_id)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getLaporanByTugas(tugas_id: string) {
  const { data, error } = await supabase
    .from('laporan')
    .select('*')
    .eq('tugas_id', tugas_id)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function updateLaporan(id: string, update: any) {
  const { data, error } = await supabase
    .from('laporan')
    .update(update)
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  return data[0];
} 