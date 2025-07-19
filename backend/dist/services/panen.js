"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPanen = createPanen;
exports.getPanen = getPanen;
exports.getPanenByGapoktan = getPanenByGapoktan;
exports.getPanenByLahan = getPanenByLahan;
exports.updatePanen = updatePanen;
exports.deletePanen = deletePanen;
const auth_1 = require("./auth");
async function createPanen(data) {
    const { error, data: inserted } = await auth_1.supabase
        .from('panen')
        .insert([data])
        .select();
    if (error)
        throw new Error(error.message);
    return inserted[0];
}
async function getPanen() {
    const { data, error } = await auth_1.supabase
        .from('panen')
        .select('*')
        .order('tanggal', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data;
}
async function getPanenByGapoktan(gapoktan_id) {
    const { data, error } = await auth_1.supabase
        .from('panen')
        .select('*')
        .eq('gapoktan_id', gapoktan_id)
        .order('tanggal', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data;
}
async function getPanenByLahan(lahan_id) {
    const { data, error } = await auth_1.supabase
        .from('panen')
        .select('*')
        .eq('lahan_id', lahan_id)
        .order('tanggal', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data;
}
async function updatePanen(id, update) {
    const { data, error } = await auth_1.supabase
        .from('panen')
        .update(update)
        .eq('id', id)
        .select();
    if (error)
        throw new Error(error.message);
    return data[0];
}
async function deletePanen(id) {
    const { error } = await auth_1.supabase
        .from('panen')
        .delete()
        .eq('id', id);
    if (error)
        throw new Error(error.message);
    return true;
}
