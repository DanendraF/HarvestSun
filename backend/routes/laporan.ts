import express from 'express';
import { createLaporan, getLaporan, getLaporanByGapoktan, getLaporanByTugas, updateLaporan } from '../services/laporan';

const router = express.Router();

// POST /laporan
router.post('/', async (req, res) => {
  try {
    const laporan = await createLaporan(req.body);
    res.json({ success: true, data: laporan });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ success: false, error: errorMsg });
  }
});

// GET /laporan
router.get('/', async (req, res) => {
  try {
    const data = await getLaporan();
    res.json({ success: true, data });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ success: false, error: errorMsg });
  }
});

// GET /laporan/gapoktan/:id
router.get('/gapoktan/:id', async (req, res) => {
  try {
    const data = await getLaporanByGapoktan(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ success: false, error: errorMsg });
  }
});

// GET /laporan/tugas/:id
router.get('/tugas/:id', async (req, res) => {
  try {
    const data = await getLaporanByTugas(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ success: false, error: errorMsg });
  }
});

// PATCH /laporan/:id
router.patch('/:id', async (req, res) => {
  try {
    const laporan = await updateLaporan(req.params.id, req.body);
    res.json({ success: true, data: laporan });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ success: false, error: errorMsg });
  }
});

export default router; 