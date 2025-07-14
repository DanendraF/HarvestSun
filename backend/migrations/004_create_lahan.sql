CREATE TABLE lahan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gapoktan_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    nama TEXT NOT NULL,
    lokasi TEXT NOT NULL,
    luas FLOAT NOT NULL,
    komoditas TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
); 