"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLaporan = createLaporan;
exports.getLaporan = getLaporan;
exports.getLaporanByGapoktan = getLaporanByGapoktan;
exports.getLaporanByTugas = getLaporanByTugas;
exports.updateLaporan = updateLaporan;
const auth_1 = require("./auth");
async function createLaporan(data) {
    const { error, data: inserted } = await auth_1.supabase
        .from('laporan')
        .insert([data])
        .select();
    if (error)
        throw new Error(error.message);
    return inserted[0];
}
async function getLaporan() {
    const { data, error } = await auth_1.supabase
        .from('laporan')
        .select('*')
        .order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data;
}
async function getLaporanByGapoktan(gapoktan_id) {
    const { data, error } = await auth_1.supabase
        .from('laporan')
        .select('*')
        .eq('gapoktan_id', gapoktan_id)
        .order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data;
}
async function getLaporanByTugas(tugas_id) {
    const { data, error } = await auth_1.supabase
        .from('laporan')
        .select('*')
        .eq('tugas_id', tugas_id)
        .order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data;
}
async function updateLaporan(id, update) {
    const { data, error } = await auth_1.supabase
        .from('laporan')
        .update(update)
        .eq('id', id)
        .select();
    if (error)
        throw new Error(error.message);
    return data[0];
}
