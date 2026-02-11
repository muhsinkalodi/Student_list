import { Pool } from 'pg';

// Restored hard-coded credentials per user's request.
// NOTE: Hard-coding credentials is not recommended for production.
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'student_data',
    password: '12345',
    port: 5432
});

export const query = (text, params) => pool.query(text, params);