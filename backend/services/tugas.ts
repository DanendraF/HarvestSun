import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';


dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function insertTugasGapoktan(data: any) {
  const { error, data: result } = await supabase
    .from('tugas_gapoktan')
    .insert([data])
    .select();
  if (error) throw new Error(error.message);
  return result;
}

export async function getAllTugas() {
  const { data, error } = await supabase
    .from('tugas_gapoktan')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getTugasByGapoktan(gapoktan_id: string) {
  const { data, error } = await supabase
    .from('tugas_gapoktan')
    .select('*')
    .eq('gapoktan_id', gapoktan_id)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getTugasByPenyuluh(penyuluh_id: string) {
  const { data, error } = await supabase
    .from('tugas_gapoktan')
    .select('*')
    .eq('penyuluh_id', penyuluh_id)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTugas(id: string, update: any) {
  const { data, error } = await supabase
    .from('tugas_gapoktan')
    .update(update)
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTugas(id: string) {
  const { data, error } = await supabase
    .from('tugas_gapoktan')
    .delete()
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  return data;
} 