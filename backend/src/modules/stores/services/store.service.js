const storeRepo = require('../repositories/store.repository');

const listStores = async (userId, query) => {
  return storeRepo.listStoresForUser(userId, query);
};

module.exports = { listStores };
