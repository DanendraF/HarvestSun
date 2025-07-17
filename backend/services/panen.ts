import { supabase } from './auth';

export async function createPanen(data: any) {
  const { error, data: inserted } = await supabase
    .from('panen')
    .insert([data])
    .select();
  if (error) throw new Error(error.message);
  return inserted[0];
}

export async function getPanen() {
  const { data, error } = await supabase
    .from('panen')
    .select('*')
    .order('tanggal', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getPanenByGapoktan(gapoktan_id: string) {
  const { data, error } = await supabase
    .from('panen')
    .select('*')
    .eq('gapoktan_id', gapoktan_id)
    .order('tanggal', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getPanenByLahan(lahan_id: string) {
  const { data, error } = await supabase
    .from('panen')
    .select('*')
    .eq('lahan_id', lahan_id)
    .order('tanggal', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function updatePanen(id: string, update: any) {
  const { data, error } = await supabase
    .from('panen')
    .update(update)
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  return data[0];
}

export async function deletePanen(id: string) {
  const { error } = await supabase
    .from('panen')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
  return true;
} 