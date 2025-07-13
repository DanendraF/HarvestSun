import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, getProfile, logoutUser } from '../services/auth';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, nama, role, no_hp, wilayah, alamat } = req.body;
  if (!email || !password || !nama || !role || !no_hp || !wilayah) {
    return res.status(400).json({ error: 'Data wajib diisi' });
  }
  const result = await registerUser({ email, password, nama, role, no_hp, wilayah, alamat });
  if (result.error) return res.status(400).json({ error: result.error.message });
  return res.status(201).json({ user: result.user });
});

router.post('/register-many', async (req, res) => {
  const users = req.body;
  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ error: 'Data array user wajib diisi' });
  }
  // Panggil service registerManyUser
  const result = await require('../services/auth').registerManyUser(users);
  return res.status(201).json(result);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email dan password wajib diisi' });
  const { data, error } = await loginUser(email, password);
  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json({ user: data.user, session: data.session });
});

router.post('/logout', async (req, res) => {
  const { error } = await logoutUser();
  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ message: 'Logout berhasil' });
});

router.get('/me', async (req, res) => {
  const user = await getCurrentUser();
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  return res.status(200).json({ user });
});

router.get('/profile', async (req, res) => {
  const userId = req.query.id as string;
  if (!userId) return res.status(400).json({ error: 'User id wajib diisi' });
  const { data, error } = await getProfile(userId);
  if (error) return res.status(404).json({ error: error.message });
  return res.status(200).json({ profile: data });
});

export default router; 