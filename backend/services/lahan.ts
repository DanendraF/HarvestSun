import { supabase } from './db';

export async function getLahanByGapoktan(gapoktan_id: string) {
  const { data, error } = await supabase
    .from('lahan')
    .select('*')
    .eq('gapoktan_id', gapoktan_id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createLahan(lahan: {
  gapoktan_id: string;
  nama: string;
  lokasi: string;
  luas: number;
  komoditas: string;
  latitude?: number;
  longitude?: number;
}) {
  const { data, error } = await supabase
    .from('lahan')
    .insert([lahan])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function updateLahan(id: string, lahan: {
  nama?: string;
  lokasi?: string;
  luas?: number;
  komoditas?: string;
  latitude?: number;
  longitude?: number;
}) {
  const { data, error } = await supabase
    .from('lahan')
    .update(lahan)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteLahan(id: string) {
  const { error } = await supabase
    .from('lahan')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
} 