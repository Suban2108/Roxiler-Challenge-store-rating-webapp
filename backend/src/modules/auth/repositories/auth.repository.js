const pool = require('../../../db/pool');

const findByEmail = async (email) => {
  const result = await pool.query(
    'SELECT id, name, email, password_hash, address, role FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const createUser = async ({ name, email, passwordHash, address, role }) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, address, role, created_at`,
    [name, email, passwordHash, address, role]
  );
  return result.rows[0];
};

const updatePassword = async (userId, passwordHash) => {
  await pool.query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [passwordHash, userId]
  );
};

const saveRefreshToken = async (userId, token, expiresAt) => {
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt]
  );
};

const findRefreshToken = async (token) => {
  const result = await pool.query(
    'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
    [token]
  );
  return result.rows[0];
};

const deleteRefreshToken = async (token) => {
  await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
};

const deleteAllRefreshTokens = async (userId) => {
  await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  updatePassword,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllRefreshTokens,
};
