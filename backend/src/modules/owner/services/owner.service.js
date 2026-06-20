const ownerRepo = require('../repositories/owner.repository');

const getDashboard = async (ownerId) => {
  return ownerRepo.getOwnerDashboard(ownerId);
};

module.exports = { getDashboard };
