create table if not exists public.tugas_gapoktan (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi text not null,
  gapoktan_id uuid not null,
  gapoktan_nama text not null,
  wilayah text not null,
  jenis text not null,
  mulai date not null,
  selesai date not null,
  prioritas text not null,
  lampiran_url text,
  catatan text,
  status text not null default 'Belum Selesai',
  penyuluh_id uuid not null,
  penyuluh_nama text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
); 