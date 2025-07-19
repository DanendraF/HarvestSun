"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
exports.insertTugasGapoktan = insertTugasGapoktan;
exports.getAllTugas = getAllTugas;
exports.getTugasByGapoktan = getTugasByGapoktan;
exports.getTugasByPenyuluh = getTugasByPenyuluh;
exports.updateTugas = updateTugas;
exports.deleteTugas = deleteTugas;
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_js_1 = require("@supabase/supabase-js");
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
async function insertTugasGapoktan(data) {
    const { error, data: result } = await exports.supabase
        .from('tugas_gapoktan')
        .insert([data])
        .select();
    if (error)
        throw new Error(error.message);
    return result;
}
async function getAllTugas() {
    const { data, error } = await exports.supabase
        .from('tugas_gapoktan')
        .select('*')
        .order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data;
}
async function getTugasByGapoktan(gapoktan_id) {
    const { data, error } = await exports.supabase
        .from('tugas_gapoktan')
        .select('*')
        .eq('gapoktan_id', gapoktan_id)
        .order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data;
}
async function getTugasByPenyuluh(penyuluh_id) {
    const { data, error } = await exports.supabase
        .from('tugas_gapoktan')
        .select('*')
        .eq('penyuluh_id', penyuluh_id)
        .order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data;
}
async function updateTugas(id, update) {
    const { data, error } = await exports.supabase
        .from('tugas_gapoktan')
        .update(update)
        .eq('id', id)
        .select();
    if (error)
        throw new Error(error.message);
    return data;
}
async function deleteTugas(id) {
    const { data, error } = await exports.supabase
        .from('tugas_gapoktan')
        .delete()
        .eq('id', id)
        .select();
    if (error)
        throw new Error(error.message);
    return data;
}
