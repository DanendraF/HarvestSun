import express from 'express';
import { createPanen, getPanen, getPanenByGapoktan, getPanenByLahan, updatePanen, deletePanen } from '../services/panen';

const router = express.Router();

// POST /api/panen
router.post('/', async (req, res) => {
  try {
    const panen = await createPanen(req.body);
    res.json({ success: true, data: panen });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

// GET /api/panen
router.get('/', async (req, res) => {
  try {
    const data = await getPanen();
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

// GET /api/panen/gapoktan/:gapoktan_id
router.get('/gapoktan/:gapoktan_id', async (req, res) => {
  try {
    const data = await getPanenByGapoktan(req.params.gapoktan_id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

// GET /api/panen/lahan/:lahan_id
router.get('/lahan/:lahan_id', async (req, res) => {
  try {
    const data = await getPanenByLahan(req.params.lahan_id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

// PATCH /api/panen/:id
router.patch('/:id', async (req, res) => {
  try {
    const panen = await updatePanen(req.params.id, req.body);
    res.json({ success: true, data: panen });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

// DELETE /api/panen/:id
router.delete('/:id', async (req, res) => {
  try {
    await deletePanen(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
