import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import 'dotenv/config';
 
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Jika perlu SSL di production:
  // ssl: { rejectUnauthorized: false },
}); 

console.log('DATABASE_URL:', process.env.DATABASE_URL); 


export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
