const pool = require('../../../db/pool');

const listStoresForUser = async (userId, query) => {
  const conditions = [];
  const values = [];
  let paramIndex = 1;

  if (query.name) {
    conditions.push(`s.name ILIKE $${paramIndex}`);
    values.push(`%${query.name}%`);
    paramIndex += 1;
  }

  if (query.address) {
    conditions.push(`s.address ILIKE $${paramIndex}`);
    values.push(`%${query.address}%`);
    paramIndex += 1;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const allowedSort = ['name', 'address', 'rating'];
  const sortField = allowedSort.includes(query.sort) ? query.sort : 'name';
  const sortDir = query.dir === 'desc' ? 'DESC' : 'ASC';
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const orderField = sortField === 'rating' ? 'avg_rating' : `s.${sortField}`;

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM stores s ${whereClause}`,
    values
  );

  values.push(userId);
  const userIdParam = paramIndex;
  paramIndex += 1;

  values.push(limit, offset);

  const result = await pool.query(
    `SELECT s.id, s.name, s.address,
            COALESCE(AVG(r.rating), 0) AS overall_rating,
            ur.rating AS user_rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $${userIdParam}
     ${whereClause}
     GROUP BY s.id, ur.rating
     ORDER BY ${orderField} ${sortDir}
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    values
  );

  return {
    stores: result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      address: row.address,
      overallRating: parseFloat(row.overall_rating) || 0,
      userRating: row.user_rating ? parseInt(row.user_rating, 10) : null,
    })),
    total: countResult.rows[0].total,
    page,
    limit,
  };
};

const findStoreByOwnerId = async (ownerId) => {
  const result = await pool.query(
    'SELECT id, name, email, address, owner_id FROM stores WHERE owner_id = $1',
    [ownerId]
  );
  return result.rows[0];
};

module.exports = { listStoresForUser, findStoreByOwnerId };
