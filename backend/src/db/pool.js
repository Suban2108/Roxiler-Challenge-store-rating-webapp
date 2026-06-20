const { Pool } = require('pg');
const config = require('../config');

// Configure pool options; enable SSL for production or when explicitly requested.
const poolOptions = {
  connectionString: config.databaseUrl,
};

const needsSsl = process.env.PGSSLMODE === 'require' || process.env.NODE_ENV === 'production' || (config.databaseUrl && config.databaseUrl.includes('sslmode=require'));
if (needsSsl) {
  poolOptions.ssl = { rejectUnauthorized: false };
}

// Reuse a global pool when running in serverless environments (Vercel, Netlify functions, etc.)
// to avoid exhausting database connections.
const globalRef = global;
if (!globalRef.__pgPool) {
  globalRef.__pgPool = new Pool(poolOptions);
  globalRef.__pgPool.on('error', (err) => {
    console.error('Unexpected database pool error', err);
  });
}

module.exports = globalRef.__pgPool;
