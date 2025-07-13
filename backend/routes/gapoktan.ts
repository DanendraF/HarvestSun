import express from 'express';
import { supabase } from '../services/auth';

const router = express.Router();

// GET /api/gapoktan?wilayah=Godean
router.get('/', async (req, res) => {
  const wilayah = req.query.wilayah as string;
  if (!wilayah) return res.status(400).json({ error: 'Wilayah wajib diisi' });
  const { data, error } = await supabase
    .from('profiles')
    .select('id, nama, wilayah')
    .eq('role', 'gapoktan')
    .eq('wilayah', wilayah);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ data });
});

export default router;