-- Migration: Create panen table
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