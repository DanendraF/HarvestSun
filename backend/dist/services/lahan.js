"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLahanByGapoktan = getLahanByGapoktan;
exports.createLahan = createLahan;
exports.updateLahan = updateLahan;
exports.deleteLahan = deleteLahan;
const db_1 = require("./db");
async function getLahanByGapoktan(gapoktan_id) {
    const { data, error } = await db_1.supabase
        .from('lahan')
        .select('*')
        .eq('gapoktan_id', gapoktan_id)
        .order('created_at', { ascending: false });
    if (error)
        throw error;
    return data;
}
async function createLahan(lahan) {
    const { data, error } = await db_1.supabase
        .from('lahan')
        .insert([lahan])
        .select();
    if (error)
        throw error;
    return data?.[0];
}
async function updateLahan(id, lahan) {
    const { data, error } = await db_1.supabase
        .from('lahan')
        .update(lahan)
        .eq('id', id)
        .select();
    if (error)
        throw error;
    return data?.[0];
}
async function deleteLahan(id) {
    const { error } = await db_1.supabase
        .from('lahan')
        .delete()
        .eq('id', id);
    if (error)
        throw error;
    return true;
}
