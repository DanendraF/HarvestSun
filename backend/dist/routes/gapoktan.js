"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../services/auth");
const router = express_1.default.Router();
// GET /api/gapoktan?wilayah=Godean
router.get('/', async (req, res) => {
    const wilayah = req.query.wilayah;
    if (!wilayah)
        return res.status(400).json({ error: 'Wilayah wajib diisi' });
    const { data, error } = await auth_1.supabase
        .from('profiles')
        .select('id, nama, wilayah')
        .eq('role', 'gapoktan')
        .eq('wilayah', wilayah);
    if (error)
        return res.status(500).json({ error: error.message });
    return res.json({ data });
});
exports.default = router;
