import pg from 'pg';

const { Pool } = pg;

// Singleton pool instance for serverless lifecycle
let pool;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      return null;
    }
    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' || connectionString.includes('sslmode=require') || connectionString.includes('neon.tech') || connectionString.includes('supabase.co')
        ? { rejectUnauthorized: false }
        : false,
    });
  }
  return pool;
}

export async function query(text, params) {
  const p = getPool();
  if (!p) {
    throw new Error('DATABASE_URL or POSTGRES_URL environment variable is not configured');
  }
  return p.query(text, params);
}
