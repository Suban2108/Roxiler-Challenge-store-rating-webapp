const storeService = require('../services/store.service');
const { sendSuccess } = require('../../../utils/response');
const { storeSearchSchema } = require('../validators/store.validator');

const listStores = async (req, res) => {
  const query = storeSearchSchema.parse(req.query);
  const result = await storeService.listStores(req.user.id, query);
  sendSuccess(res, result);
};

module.exports = { listStores };
