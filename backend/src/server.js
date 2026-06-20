const app = require('./app');
const config = require('./config');
const pool = require('./db/pool');

const start = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected');

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
