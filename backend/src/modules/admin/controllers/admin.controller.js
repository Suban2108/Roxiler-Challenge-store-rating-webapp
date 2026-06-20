const adminService = require('../services/admin.service');
const { sendSuccess } = require('../../../utils/response');
const {
  createUserSchema,
  createStoreSchema,
  userListQuerySchema,
  storeListQuerySchema,
} = require('../validators/admin.validator');

const getDashboard = async (req, res) => {
  const stats = await adminService.getDashboard();
  sendSuccess(res, { stats });
};

const listUsers = async (req, res) => {
  const query = userListQuerySchema.parse(req.query);
  const result = await adminService.listUsers(query);
  sendSuccess(res, result);
};

const getUser = async (req, res) => {
  const user = await adminService.getUser(parseInt(req.params.id, 10));
  sendSuccess(res, { user });
};

const createUser = async (req, res) => {
  const data = createUserSchema.parse(req.body);
  const user = await adminService.createUser(data);
  sendSuccess(res, { user }, 'User created successfully', 201);
};

const listStores = async (req, res) => {
  const query = storeListQuerySchema.parse(req.query);
  const result = await adminService.listStores(query);
  sendSuccess(res, result);
};

const createStore = async (req, res) => {
  const data = createStoreSchema.parse(req.body);
  const store = await adminService.createStore(data);
  sendSuccess(res, { store }, 'Store created successfully', 201);
};

module.exports = {
  getDashboard,
  listUsers,
  getUser,
  createUser,
  listStores,
  createStore,
};
