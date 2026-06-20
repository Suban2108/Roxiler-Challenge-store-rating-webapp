const bcrypt = require('bcryptjs');
const config = require('../../../config');
const AppError = require('../../../errors/AppError');
const adminRepo = require('../repositories/admin.repository');
const authRepo = require('../../auth/repositories/auth.repository');
const pool = require('../../../db/pool');

const getDashboard = async () => {
  return adminRepo.getDashboardStats();
};

const listUsers = async (query) => {
  return adminRepo.listUsers(query);
};

const getUser = async (id) => {
  const user = await adminRepo.getUserById(id);
  if (!user) {
    throw new AppError('NOT_FOUND', 404, 'User not found');
  }
  return user;
};

const createUser = async (data) => {
  const existing = await authRepo.findByEmail(data.email);
  if (existing) {
    throw new AppError('EMAIL_EXISTS', 409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(data.password, config.bcryptRounds);
  const user = await authRepo.createUser({
    name: data.name,
    email: data.email,
    passwordHash,
    address: data.address,
    role: data.role,
  });

  return user;
};

const listStores = async (query) => {
  return adminRepo.listStores(query);
};

const createStore = async (data) => {
  const owner = await authRepo.findById(data.ownerId);
  if (!owner || owner.role !== 'store_owner') {
    throw new AppError('INVALID_OWNER', 400, 'Owner must be a store owner user');
  }

  const existing = await pool.query(
    'SELECT id FROM stores WHERE owner_id = $1',
    [data.ownerId]
  );
  if (existing.rows.length > 0) {
    throw new AppError('STORE_EXISTS', 409, 'This owner already has a store');
  }

  return adminRepo.createStore(data);
};

module.exports = {
  getDashboard,
  listUsers,
  getUser,
  createUser,
  listStores,
  createStore,
};
