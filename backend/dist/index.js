"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const auth_2 = require("./services/auth");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const tugas_1 = __importDefault(require("./routes/tugas"));
const gapoktan_1 = __importDefault(require("./routes/gapoktan"));
const laporan_1 = __importDefault(require("./routes/laporan"));
const cuaca_1 = __importDefault(require("./routes/cuaca"));
const lahan_1 = __importDefault(require("./routes/lahan"));
const panen_1 = __importDefault(require("./routes/panen"));
const reverseGeocode_1 = __importDefault(require("./routes/reverseGeocode"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Route auth
app.use('/api/auth', auth_1.default);
// Route tugas
app.use('/api/tugas', tugas_1.default);
app.use('/api/gapoktan', gapoktan_1.default);
app.use('/api/laporan', laporan_1.default);
app.use('/api/lahan', lahan_1.default);
app.use('/api/reverse-geocode', reverseGeocode_1.default);
app.use('/api', cuaca_1.default);
app.use('/api/panen', panen_1.default);
async function testSupabaseConnection() {
    const { data, error } = await auth_2.supabase.from('profiles').select('*').limit(1);
    if (error) {
        console.error('Koneksi ke Supabase GAGAL:', error.message);
    }
    else {
        console.log('Koneksi ke Supabase BERHASIL! Hello Big F 🧑‍💻');
    }
}
// Panggil fungsi ini sekali saat server start
testSupabaseConnection();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
//
//
