# HarvestSun - Digital Agriculture Management Platform

## Ringkasan
HarvestSun adalah platform manajemen pertanian digital yang dirancang untuk memudahkan penyuluh dan gapoktan (kelompok tani) dalam mengelola tugas, laporan, agenda, peta lahan, serta komunikasi secara terintegrasi. Sistem ini terdiri dari frontend (antarmuka pengguna) berbasis Next.js dan backend API yang terhubung ke Supabase untuk autentikasi, database, dan penyimpanan file.

---

## Daftar Isi
- [Fitur Utama](#fitur-utama)
- [Arsitektur & Alur Sistem](#arsitektur--alur-sistem)
- [Struktur Proyek](#struktur-proyek)
- [Penjelasan Folder & File Penting](#penjelasan-folder--file-penting)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Panduan Instalasi & Menjalankan Aplikasi](#panduan-instalasi--menjalankan-aplikasi)
- [Catatan Pengembangan](#catatan-pengembangan)

---

## Fitur Utama

### 1. Autentikasi & Manajemen Akun
- **Login & Registrasi**: Pengguna dapat mendaftar sebagai penyuluh atau gapoktan, login dengan email & password, serta logout dengan aman.
- **Manajemen Profil**: Setiap pengguna dapat memperbarui data profil dan wilayah.

### 2. Dashboard Dinamis
- **Dashboard Penyuluh**: Statistik tugas, laporan, tren panen, dan peta wilayah gapoktan binaan.
- **Dashboard Gapoktan**: Data aktivitas gapoktan, agenda, laporan, dan informasi penting lainnya.
- **Navigasi Otomatis**: Sidebar menyesuaikan menu sesuai peran pengguna.

### 3. Manajemen Tugas
- **Penyuluh → Gapoktan**: Penyuluh dapat membuat, mengelola, dan memantau tugas untuk gapoktan, lengkap dengan lampiran file.
- **Validasi Otomatis**: Semua field wajib divalidasi sebelum submit.
- **Upload Lampiran**: File (pdf, gambar, doc) diupload ke Supabase Storage, URL file otomatis dikirim ke backend.

### 4. Laporan & Agenda
- **Laporan**: Penyuluh dan gapoktan dapat membuat dan melihat laporan (hasil panen, kendala, dsb).
- **Agenda**: Gapoktan dapat mengelola agenda seperti rapat, pelatihan, dan kegiatan lain.
- **Peta Lahan**: Penyuluh dapat melihat dan mengelola peta lahan binaan.

---

## Arsitektur & Alur Sistem

1. **Frontend** (Next.js, TypeScript)
   - Menyediakan antarmuka pengguna yang responsif dan ramah pengguna.
   - Mengelola state autentikasi, navigasi, dan komunikasi dengan backend melalui API client (`lib/api.ts`).
   - Upload file langsung ke Supabase Storage.

2. **Backend** (API terhubung Supabase)
   - Menyediakan endpoint untuk autentikasi, manajemen user, tugas, laporan, dan agenda.
   - Menyimpan data di database Supabase (Postgres) dan file di Supabase Storage.

3. **Alur Data**
   - User login/register → data dikirim ke backend → backend validasi & balas data user.
   - User tambah tugas → jika ada file, file diupload ke Supabase Storage → URL file + data tugas dikirim ke backend → backend simpan ke database.
   - User melihat daftar tugas/laporan → frontend fetch data dari backend → tampilkan di tabel/list.
   - Navigasi dan akses fitur otomatis menyesuaikan role user.

---

## Struktur Proyek

```
project/
  app/                # Halaman utama (frontend)
  components/         # Komponen UI (sidebar, dashboard, tombol, dsb)
  hooks/              # Custom hooks (logika auth, toast)
  lib/                # API client, utilitas, supabase client
  data/               # Data sample/mock (untuk testing)
  types/              # Definisi tipe data (User, Task, dsb)
  ...
```

---

## Penjelasan Folder & File Penting

- `app/`  
  - `login/`, `register/`: Halaman login & registrasi.
  - `penyuluh/`, `gapoktan/`: Halaman khusus untuk masing-masing role.
  - `dashboard/`, `tugas/`, `laporan/`, `agenda/`, `peta-lahan/`, `pengaturan-akun/`: Fitur utama per role.
- `components/`  
  - `layout/Sidebar.tsx`: Sidebar navigasi, otomatis menyesuaikan role.
  - `layout/DashboardLayout.tsx`: Layout utama dashboard.
  - `dashboard/`: Komponen dashboard per role.
  - `ui/`: Komponen UI kecil (tombol, card, dsb).
- `hooks/useAuth.tsx`: Logika login, logout, register, mapping user.
- `lib/api.ts`: Semua fungsi komunikasi ke backend (login, register, tugas, dsb).
- `lib/supabaseClient.ts`: Koneksi ke Supabase (untuk upload file & auth).
- `types/index.ts`: Definisi tipe data (User, Task, dsb) agar kode lebih aman & mudah dipahami.

---

## Teknologi yang Digunakan
- **Next.js** (React Framework) — Frontend modern, SSR/CSR
- **TypeScript** — Bahasa pemrograman aman & terstruktur
- **Supabase** — Autentikasi, database, dan storage
- **TailwindCSS** — Styling UI
- **Radix UI** — Komponen UI aksesibel
- **Chart.js/Recharts** — Visualisasi data

---

## Konfigurasi Environment

Buat file `.env.local` di folder `project/` dan isi variabel berikut:

### Frontend
```
NEXT_PUBLIC_API_URL=<URL_BACKEND_API>
NEXT_PUBLIC_SUPABASE_URL=<URL_SUPABASE_PROJECT>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
```

### Backend
```
SUPABASE_URL=<URL_SUPABASE_PROJECT>
SUPABASE_KEY=<SUPABASE_SERVICE_ROLE_KEY>
```

---

## Panduan Instalasi & Menjalankan Aplikasi

1. **Install Node.js** (unduh dari https://nodejs.org)
2. **Install dependencies**
   ```
   npm install
   ```
3. **Konfigurasi environment** (lihat bagian di atas)
4. **Jalankan aplikasi**
   ```
   npm run dev
   ```
   Akses di browser: [http://localhost:3000](http://localhost:3000)

---

## Catatan Pengembangan
- Struktur kode dipisah rapi: komponen, halaman, hooks, dan API agar mudah dipelajari dan dikembangkan.
- Tidak perlu pengalaman JavaScript/TypeScript untuk menjalankan aplikasi — cukup ikuti panduan di atas.
- Untuk pengembangan lebih lanjut, baca file di `components/`, `app/`, dan `lib/` untuk memahami alur data dan UI.
- Dokumentasi kode dan komentar sudah disediakan di banyak bagian untuk memudahkan pemahaman.

---

## Dokumentasi API (Backend)

Seluruh endpoint backend tersedia di file [EXPOSMS4.postman_collection.json](./EXPOSMS4.postman_collection.json) yang dapat diimpor ke Postman untuk eksplorasi dan pengujian.

Contoh endpoint utama:
- `POST /api/auth/register` — Registrasi user
- `POST /api/auth/login` — Login user
- `GET /api/cuaca?kota=Yogyakarta` — Data cuaca
- `GET /api/panen` — Daftar panen
- `GET /api/lahan?gapoktan_id=...` — Daftar lahan
- `GET /api/tugas` — Daftar tugas
- `GET /api/gapoktan?wilayah=...` — Daftar gapoktan
- `GET /api/laporan` — Daftar laporan
- `GET /api/reverse-geocode?lat=...&lon=...` — Reverse geocoding
- ... (lihat koleksi Postman untuk endpoint lengkap)

---

## Menjalankan Backend

1. Masuk ke folder backend:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Buat file `.env` dan isi variabel yang dibutuhkan (lihat contoh di atas).
4. Jalankan backend:
   ```
   npm run dev
   ```
   Default: [http://localhost:4000](http://localhost:4000)

---


## Cara Menggunakan Koleksi Postman

1. Buka aplikasi Postman.
2. Pilih menu **Import** → **Upload Files** → pilih file `EXPOSMS4.postman_collection.json`.
3. Setelah diimpor, semua endpoint siap diuji.
4. Ubah variable `base_url` sesuai alamat backend Anda jika perlu.

---

## Kontribusi

Jika ingin berkontribusi, silakan buat branch baru dan ajukan pull request. Ikuti standar penamaan branch dan pastikan kode sudah teruji sebelum merge. Untuk diskusi fitur atau bug, gunakan fitur Issues di repository ini.

---

## Testing

Jalankan perintah berikut untuk menjalankan test (jika tersedia):
```
npm test
```
Pastikan semua test lulus sebelum melakukan pull request.

---

## Troubleshooting

- **Error koneksi ke Supabase:** Pastikan variabel environment sudah benar dan Supabase aktif.
- **Port sudah digunakan:** Ubah port di file konfigurasi atau matikan aplikasi lain yang menggunakan port tersebut.
- **Gagal upload file:** Pastikan kredensial Supabase Storage sudah benar dan quota storage cukup.
- **Masalah dependensi:** Jalankan `npm install` ulang di folder frontend/backend.

---


## Kontak

Untuk pertanyaan lebih lanjut, hubungi: 
- Email: harvestsunmari@gmail.com
- Atau gunakan fitur Issues di repository ini.

--- 