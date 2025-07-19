"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const laporan_1 = require("../services/laporan");
const router = express_1.default.Router();
// POST /laporan
router.post('/', async (req, res) => {
    try {
        const laporan = await (0, laporan_1.createLaporan)(req.body);
        res.json({ success: true, data: laporan });
    }
    catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        res.status(400).json({ success: false, error: errorMsg });
    }
});
// GET /laporan
router.get('/', async (req, res) => {
    try {
        const data = await (0, laporan_1.getLaporan)();
        res.json({ success: true, data });
    }
    catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        res.status(400).json({ success: false, error: errorMsg });
    }
});
// GET /laporan/gapoktan/:id
router.get('/gapoktan/:id', async (req, res) => {
    console.log('GET /laporan/gapoktan/:id', req.params.id); // log id yang diterima
    try {
        const data = await (0, laporan_1.getLaporanByGapoktan)(req.params.id);
        res.json({ success: true, data });
    }
    catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('Error getLaporanByGapoktan:', errorMsg); // log error detail
        res.status(400).json({ success: false, error: errorMsg });
    }
});
// GET /laporan/tugas/:id
router.get('/tugas/:id', async (req, res) => {
    try {
        const data = await (0, laporan_1.getLaporanByTugas)(req.params.id);
        res.json({ success: true, data });
    }
    catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        res.status(400).json({ success: false, error: errorMsg });
    }
});
// PATCH /laporan/:id
router.patch('/:id', async (req, res) => {
    try {
        const laporan = await (0, laporan_1.updateLaporan)(req.params.id, req.body);
        res.json({ success: true, data: laporan });
    }
    catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        res.status(400).json({ success: false, error: errorMsg });
    }
});
exports.default = router;
