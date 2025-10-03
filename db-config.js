// Database configuration
const { Pool } = require('pg');

// Parse DATABASE_URL if it exists, otherwise use individual environment variables
let dbConfig = {};

if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  dbConfig = {
    host: url.hostname,
    port: url.port,
    database: url.pathname.slice(1),
    user: url.username,
    password: url.password,
    ssl: { rejectUnauthorized: false }
  };
} else {
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'listicles_games',
    user: process.env.DB_USER || 'lorenzobolls',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') ? { rejectUnauthorized: false } : false
  };
}

const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

module.exports = pool;
