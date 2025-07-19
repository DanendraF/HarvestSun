"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tugas_1 = require("../services/tugas");
const router = express_1.default.Router();
// POST /api/tugas
router.post('/', async (req, res) => {
    try {
        const { judul, deskripsi, gapoktan_id, gapoktan_nama, wilayah, jenis, mulai, selesai, prioritas, lampiran_url, catatan, penyuluh_id, penyuluh_nama } = req.body;
        if (!judul || !deskripsi || !gapoktan_id || !gapoktan_nama || !wilayah || !jenis || !mulai || !selesai || !prioritas || !penyuluh_id || !penyuluh_nama) {
            return res.status(400).json({ error: 'Semua field wajib diisi!' });
        }
        const data = await (0, tugas_1.insertTugasGapoktan)({
            judul, deskripsi, gapoktan_id, gapoktan_nama, wilayah, jenis,
            mulai, selesai, prioritas, lampiran_url, catatan, penyuluh_id, penyuluh_nama
        });
        res.status(201).json({ data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET /api/tugas
router.get('/', async (req, res) => {
    try {
        const data = await (0, tugas_1.getAllTugas)();
        res.json({ data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET /api/tugas/gapoktan/:gapoktan_id
router.get('/gapoktan/:gapoktan_id', async (req, res) => {
    try {
        const { gapoktan_id } = req.params;
        const data = await (0, tugas_1.getTugasByGapoktan)(gapoktan_id);
        res.json({ data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET /api/tugas/penyuluh/:penyuluh_id
router.get('/penyuluh/:penyuluh_id', async (req, res) => {
    try {
        const { penyuluh_id } = req.params;
        const data = await (0, tugas_1.getTugasByPenyuluh)(penyuluh_id);
        res.json({ data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// PATCH /api/tugas/:id
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const data = await (0, tugas_1.updateTugas)(id, update);
        res.json({ data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE /api/tugas/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await (0, tugas_1.deleteTugas)(id);
        res.json({ data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
