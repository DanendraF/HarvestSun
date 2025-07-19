"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.pool = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const pg_1 = require("pg");
require("dotenv/config");
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    // Jika perlu SSL di production:
    // ssl: { rejectUnauthorized: false },
});
console.log('DATABASE_URL:', process.env.DATABASE_URL);
exports.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
