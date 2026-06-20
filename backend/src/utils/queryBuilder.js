const ALLOWED_SORT_FIELDS = {
  users: ['name', 'email', 'address', 'role', 'created_at'],
  stores: ['name', 'email', 'address', 'rating', 'created_at'],
  ratings: ['rating', 'created_at'],
};

const buildListQuery = ({
  tableAlias = '',
  allowedSortFields = [],
  allowedFilters = [],
  query = {},
}) => {
  const prefix = tableAlias ? `${tableAlias}.` : '';
  const conditions = [];
  const values = [];
  let paramIndex = 1;

  for (const field of allowedFilters) {
    const value = query[field];
    if (value !== undefined && value !== '' && value !== null) {
      if (field === 'role') {
        conditions.push(`${prefix}${field} = $${paramIndex}`);
        values.push(value);
      } else {
        conditions.push(`${prefix}${field} ILIKE $${paramIndex}`);
        values.push(`%${value}%`);
      }
      paramIndex += 1;
    }
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const sortField = allowedSortFields.includes(query.sort) ? query.sort : allowedSortFields[0];
  const sortDir = query.dir === 'desc' ? 'DESC' : 'ASC';
  const orderClause = `ORDER BY ${prefix}${sortField} ${sortDir}`;

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  const paginationClause = `LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  values.push(limit, offset);

  return {
    whereClause,
    orderClause,
    paginationClause,
    values,
    page,
    limit,
  };
};

module.exports = { buildListQuery, ALLOWED_SORT_FIELDS };
