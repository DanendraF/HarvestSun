import express from 'express';
import { getLahanByGapoktan, createLahan, updateLahan, deleteLahan } from '../services/lahan';

const router = express.Router();

// GET /api/lahan?gapoktan_id=...
router.get('/', async (req, res) => {
  const { gapoktan_id } = req.query;
  if (!gapoktan_id) return res.status(400).json({ error: 'gapoktan_id is required' });
  try {
    const data = await getLahanByGapoktan(gapoktan_id as string);
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/lahan
router.post('/', async (req, res) => {
  const { gapoktan_id, nama, lokasi, luas, komoditas, latitude, longitude } = req.body;
  if (!gapoktan_id || !nama || !lokasi || !luas || !komoditas) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const data = await createLahan({ gapoktan_id, nama, lokasi, luas, komoditas, latitude, longitude });
    res.status(201).json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/lahan/:id
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { nama, lokasi, luas, komoditas, latitude, longitude } = req.body;
  if (!nama && !lokasi && !luas && !komoditas && !latitude && !longitude) {
    return res.status(400).json({ error: 'At least one field is required' });
  }
  try {
    const data = await updateLahan(id, { nama, lokasi, luas, komoditas, latitude, longitude });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/lahan/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteLahan(id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router; 