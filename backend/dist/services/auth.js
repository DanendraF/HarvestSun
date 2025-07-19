"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
exports.registerUser = registerUser;
exports.registerManyUser = registerManyUser;
exports.loginUser = loginUser;
exports.getCurrentUser = getCurrentUser;
exports.getProfile = getProfile;
exports.logoutUser = logoutUser;
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_js_1 = require("@supabase/supabase-js");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
// Register user (penyuluh/gapoktan)
async function registerUser({ email, password, nama, role, no_hp, wilayah, alamat }) {
    // 1. Register ke Supabase Auth
    const { data, error } = await exports.supabase.auth.signUp({
        email,
        password,
        options: {
            data: { nama, role, no_hp, wilayah, alamat }
        }
    });
    if (error || !data.user)
        return { error: error || new Error('User not created') };
    // 2. Hash password dan insert ke tabel profiles
    const hash = await bcryptjs_1.default.hash(password, 10);
    await exports.supabase.from('profiles').insert([{
            id: data.user.id,
            nama,
            email, // tambahkan email
            role,
            no_hp,
            wilayah,
            alamat,
            password: hash
        }]);
    return { user: data.user };
}
// Register banyak user sekaligus
async function registerManyUser(users) {
    const results = [];
    for (const user of users) {
        try {
            // Register ke Supabase Auth
            const { data, error } = await exports.supabase.auth.signUp({
                email: user.email,
                password: user.password,
                options: {
                    data: { nama: user.nama, role: user.role, no_hp: user.no_hp, wilayah: user.wilayah, alamat: user.alamat }
                }
            });
            if (error || !data.user) {
                results.push({ email: user.email, success: false, error: error?.message || 'User not created' });
                continue;
            }
            // Hash password dan insert ke tabel profiles
            const hash = await bcryptjs_1.default.hash(user.password, 10);
            await exports.supabase.from('profiles').insert([{
                    id: data.user.id,
                    nama: user.nama,
                    email: user.email, // tambahkan email
                    role: user.role,
                    no_hp: user.no_hp,
                    wilayah: user.wilayah,
                    alamat: user.alamat,
                    password: hash
                }]);
            results.push({ email: user.email, success: true });
        }
        catch (err) {
            results.push({ email: user.email, success: false, error: err.message });
        }
    }
    return { results };
}
// Login user
async function loginUser(email, password) {
    const { data, error } = await exports.supabase.auth.signInWithPassword({ email, password });
    return { data, error };
}
// Get current user
async function getCurrentUser() {
    const { data: { user } } = await exports.supabase.auth.getUser();
    return user;
}
// Get profile
async function getProfile(userId) {
    const { data, error } = await exports.supabase.from('profiles').select('*').eq('id', userId).single();
    return { data, error };
}
// Logout user
async function logoutUser() {
    const { error } = await exports.supabase.auth.signOut();
    return { error };
}
