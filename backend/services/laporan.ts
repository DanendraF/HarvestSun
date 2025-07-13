import { pool } from './db';

export async function createLaporan(data: any) {
  const { tugas_id, gapoktan_id, judul_laporan, isi_laporan, tanggal_laporan, status_laporan, lampiran, catatan_penyuluh, penyuluh_id, penyuluh_nama } = data;
  const result = await pool.query(
    `INSERT INTO laporan (tugas_id, gapoktan_id, judul_laporan, isi_laporan, tanggal_laporan, status_laporan, lampiran, catatan_penyuluh, penyuluh_id, penyuluh_nama)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [tugas_id, gapoktan_id, judul_laporan, isi_laporan, tanggal_laporan, status_laporan, lampiran, catatan_penyuluh, penyuluh_id, penyuluh_nama]
  );
  return result.rows[0];
}

export async function getLaporan() {
  const result = await pool.query(`
    SELECT l.*, g.nama AS gapoktan_nama
    FROM laporan l
    LEFT JOIN profiles g ON l.gapoktan_id = g.id
    ORDER BY l.created_at DESC
  `);
  return result.rows;
}

export async function getLaporanByGapoktan(gapoktan_id: string) {
  const result = await pool.query(`
    SELECT l.*, g.nama AS gapoktan_nama
    FROM laporan l
    LEFT JOIN profiles g ON l.gapoktan_id = g.id
    WHERE l.gapoktan_id = $1
    ORDER BY l.created_at DESC
  `, [gapoktan_id]);
  return result.rows;
}

export async function getLaporanByTugas(tugas_id: string) {
  const result = await pool.query(`
    SELECT l.*, g.nama AS gapoktan_nama
    FROM laporan l
    LEFT JOIN profiles g ON l.gapoktan_id = g.id
    WHERE l.tugas_id = $1
    ORDER BY l.created_at DESC
  `, [tugas_id]);
  return result.rows;
}

export async function updateLaporan(id: string, update: any) {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in update) {
    fields.push(`${key} = $${idx}`);
    values.push(update[key]);
    idx++;
  }
  values.push(id);
  const result = await pool.query(
    `UPDATE laporan SET ${fields.join(', ')}, updated_at = now() WHERE id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0];
} 