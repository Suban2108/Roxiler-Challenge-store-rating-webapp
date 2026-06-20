const pool = require('../../../db/pool');

const upsertRating = async (userId, storeId, rating) => {
  const result = await pool.query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, store_id)
     DO UPDATE SET rating = $3, updated_at = NOW()
     RETURNING id, user_id, store_id, rating, created_at, updated_at`,
    [userId, storeId, rating]
  );
  return result.rows[0];
};

const findStoreById = async (storeId) => {
  const result = await pool.query('SELECT id FROM stores WHERE id = $1', [storeId]);
  return result.rows[0];
};

module.exports = { upsertRating, findStoreById };
