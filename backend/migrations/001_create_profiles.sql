-- Migration: Create profiles table for penyuluh & gapoktan

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