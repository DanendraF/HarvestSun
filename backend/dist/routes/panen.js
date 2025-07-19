"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const panen_1 = require("../services/panen");
const router = express_1.default.Router();
// POST /api/panen
router.post('/', async (req, res) => {
    try {
        const panen = await (0, panen_1.createPanen)(req.body);
        res.json({ success: true, data: panen });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err instanceof Error ? err.message : String(err) });
    }
});
// GET /api/panen
router.get('/', async (req, res) => {
    try {
        const data = await (0, panen_1.getPanen)();
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err instanceof Error ? err.message : String(err) });
    }
});
// GET /api/panen/gapoktan/:gapoktan_id
router.get('/gapoktan/:gapoktan_id', async (req, res) => {
    try {
        const data = await (0, panen_1.getPanenByGapoktan)(req.params.gapoktan_id);
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err instanceof Error ? err.message : String(err) });
    }
});
// GET /api/panen/lahan/:lahan_id
router.get('/lahan/:lahan_id', async (req, res) => {
    try {
        const data = await (0, panen_1.getPanenByLahan)(req.params.lahan_id);
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err instanceof Error ? err.message : String(err) });
    }
});
// PATCH /api/panen/:id
router.patch('/:id', async (req, res) => {
    try {
        const panen = await (0, panen_1.updatePanen)(req.params.id, req.body);
        res.json({ success: true, data: panen });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err instanceof Error ? err.message : String(err) });
    }
});
// DELETE /api/panen/:id
router.delete('/:id', async (req, res) => {
    try {
        await (0, panen_1.deletePanen)(req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        res.status(400).json({ success: false, error: err instanceof Error ? err.message : String(err) });
    }
});
exports.default = router;
