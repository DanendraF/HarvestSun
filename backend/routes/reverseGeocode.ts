import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

router.get('/', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat/lon required' });
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'HarvestSun/1.0' } });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reverse geocode' });
  }
});

export default router; 