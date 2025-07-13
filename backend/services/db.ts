import { Pool } from 'pg';
 
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Jika perlu SSL di production:
  // ssl: { rejectUnauthorized: false },
}); 