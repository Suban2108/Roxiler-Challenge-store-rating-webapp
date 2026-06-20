const pool = require('../../../db/pool');
const { buildListQuery, ALLOWED_SORT_FIELDS } = require('../../../utils/queryBuilder');

const getDashboardStats = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*)::int FROM users) AS total_users,
      (SELECT COUNT(*)::int FROM stores) AS total_stores,
      (SELECT COUNT(*)::int FROM ratings) AS total_ratings
  `);
  return result.rows[0];
};

const listUsers = async (query) => {
  const { whereClause, orderClause, paginationClause, values, page, limit } =
    buildListQuery({
      tableAlias: 'u',
      allowedSortFields: ALLOWED_SORT_FIELDS.users,
      allowedFilters: ['name', 'email', 'address', 'role'],
      query,
    });

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM users u ${whereClause}`,
    values.slice(0, values.length - 2)
  );

  const result = await pool.query(
  `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
          CASE WHEN u.role = 'store_owner' THEN
            COALESCE(AVG(r.rating), 0)
          ELSE NULL END AS rating
   FROM users u
   LEFT JOIN stores s ON s.owner_id = u.id
   LEFT JOIN ratings r ON r.store_id = s.id
   ${whereClause}
   GROUP BY u.id
   ${orderClause}
   ${paginationClause}`,
    values
  );

  return {
    users: result.rows,
    total: countResult.rows[0].total,
    page,
    limit,
  };
};

const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
            CASE WHEN u.role = 'store_owner' THEN
              COALESCE(AVG(r.rating), 0)
            ELSE NULL END AS rating
     FROM users u
     LEFT JOIN stores s ON s.owner_id = u.id
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE u.id = $1
     GROUP BY u.id`,
    [id]
  );
  return result.rows[0];
};

const listStores = async (query) => {
  const sortField = query.sort;
  const allowedSort = ALLOWED_SORT_FIELDS.stores;
  const effectiveSort = allowedSort.includes(sortField) ? sortField : 'name';
  const sortDir = query.dir === 'desc' ? 'DESC' : 'ASC';

  const conditions = [];
  const values = [];
  let paramIndex = 1;

  ['name', 'email', 'address'].forEach((field) => {
    if (query[field]) {
      conditions.push(`s.${field} ILIKE $${paramIndex}`);
      values.push(`%${query[field]}%`);
      paramIndex += 1;
    }
  });

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM stores s ${whereClause}`,
    values
  );

  const orderField = effectiveSort === 'rating' ? 'avg_rating' : `s.${effectiveSort}`;
  const result = await pool.query(
    `SELECT s.id, s.name, s.email, s.address, s.owner_id,
            COALESCE(AVG(r.rating), 0) AS rating,
            u.name AS owner_name
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     LEFT JOIN users u ON u.id = s.owner_id
     ${whereClause}
     GROUP BY s.id, u.name
     ORDER BY ${orderField} ${sortDir}
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...values, limit, offset]
  );

  return {
    stores: result.rows,
    total: countResult.rows[0].total,
    page,
    limit,
  };
};

const createStore = async (data) => {
  const result = await pool.query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, address, owner_id, created_at`,
    [data.name, data.email, data.address, data.ownerId]
  );
  return result.rows[0];
};

module.exports = {
  getDashboardStats,
  listUsers,
  getUserById,
  listStores,
  createStore,
};
