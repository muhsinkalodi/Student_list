import { Pool } from 'pg';

// Restored hard-coded credentials per user's request.
// NOTE: Hard-coding credentials is not recommended for production.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
});

export const query = (text, params) => pool.query(text, params);