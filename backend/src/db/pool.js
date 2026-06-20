const config = require('../config');
const postgres = require('postgres');

const pool = new postgres({
  connectionString: config.databaseUrl,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error', err);
});

module.exports = pool;
