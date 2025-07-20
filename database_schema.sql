-- =============================
-- 1. Create profiles table
-- =============================

create table profiles (
  id uuid references auth.users(id) primary key,
  nama text not null,
  role text not null, -- 'penyuluh' atau 'gapoktan'
  no_hp text,
  wilayah text,       -- kecamatan di Sleman
  alamat text,        -- hanya diisi gapoktan
  password text,      -- hash password (opsional, untuk custom auth)
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index profiles_wilayah_idx on profiles(wilayah);
create index profiles_role_idx on profiles(role);

-- =============================
-- 2. Create tugas_gapoktan table
-- =============================

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

-- =============================
-- 3. Create laporan table
-- =============================

CREATE TABLE laporan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tugas_id UUID REFERENCES tugas_gapoktan(id) ON DELETE CASCADE,
    gapoktan_id UUID NOT NULL,
    judul_laporan VARCHAR(255) NOT NULL,
    isi_laporan TEXT NOT NULL,
    tanggal_laporan DATE NOT NULL,
    status_laporan VARCHAR(20) NOT NULL CHECK (status_laporan IN ('Belum Divalidasi', 'Valid', 'Perlu Revisi')),
    lampiran VARCHAR(512),
    catatan_penyuluh TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index untuk pencarian cepat
CREATE INDEX idx_laporan_gapoktan_id ON laporan(gapoktan_id);
CREATE INDEX idx_laporan_tugas_id ON laporan(tugas_id);

-- =============================
-- 4. Create lahan table
-- =============================

CREATE TABLE lahan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gapoktan_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    nama TEXT NOT NULL,
    lokasi TEXT NOT NULL,
    luas FLOAT NOT NULL,
    komoditas TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- =============================
-- 5. Create panen table
-- =============================

CREATE TABLE panen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gapoktan_id UUID NOT NULL,
    lahan_id UUID,
    komoditas VARCHAR(50) NOT NULL,
    jumlah NUMERIC NOT NULL,
    satuan VARCHAR(20) DEFAULT 'kg',
    tanggal DATE NOT NULL,
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_panen_gapoktan_id ON panen(gapoktan_id);
CREATE INDEX idx_panen_lahan_id ON panen(lahan_id);

-- =============================
-- 6. Alter laporan: add penyuluh_id & penyuluh_nama
-- =============================

ALTER TABLE laporan
ADD COLUMN penyuluh_id UUID,
ADD COLUMN penyuluh_nama VARCHAR(100);

-- =============================
-- 7. Alter lahan: add latitude & longitude
-- =============================

ALTER TABLE lahan
ADD COLUMN latitude FLOAT,
ADD COLUMN longitude FLOAT; 