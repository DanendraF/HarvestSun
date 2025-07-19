"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon)
        return res.status(400).json({ error: 'lat/lon required' });
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    try {
        const response = await (0, node_fetch_1.default)(url, { headers: { 'User-Agent': 'HarvestSun/1.0' } });
        const data = await response.json();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch reverse geocode' });
    }
});
exports.default = router;
