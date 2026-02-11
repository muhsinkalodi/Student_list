import { Pool } from 'pg';

// Use environment variable for production, fallback to hardcoded for development
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_RoJB0h6gtjyS@ep-spring-water-a1a9cfpd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const query = (text, params) => pool.query(text, params);