const pool = require('../../../db/pool');

const getOwnerDashboard = async (ownerId) => {
  const storeResult = await pool.query(
    'SELECT id, name FROM stores WHERE owner_id = $1',
    [ownerId]
  );

  const store = storeResult.rows[0];
  if (!store) {
    return { store: null, averageRating: 0, raters: [] };
  }

  const avgResult = await pool.query(
    'SELECT COALESCE(AVG(rating), 0) AS average_rating FROM ratings WHERE store_id = $1',
    [store.id]
  );

  const ratersResult = await pool.query(
    `SELECT u.id, u.name, u.email, u.address, r.rating, r.created_at
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = $1
     ORDER BY r.created_at DESC`,
    [store.id]
  );

  return {
    store,
    averageRating: parseFloat(avgResult.rows[0].average_rating) || 0,
    raters: ratersResult.rows,
  };
};

module.exports = { getOwnerDashboard };
