const ownerService = require('../services/owner.service');
const { sendSuccess } = require('../../../utils/response');

const getDashboard = async (req, res) => {
  const dashboard = await ownerService.getDashboard(req.user.id);
  sendSuccess(res, { dashboard });
};

module.exports = { getDashboard };
