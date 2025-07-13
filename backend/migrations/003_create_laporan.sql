-- Migration: Create laporan table
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