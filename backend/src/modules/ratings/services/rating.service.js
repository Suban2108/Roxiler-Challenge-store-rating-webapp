const AppError = require('../../../errors/AppError');
const ratingRepo = require('../repositories/rating.repository');

const submitOrUpdateRating = async (userId, storeId, rating) => {
  const store = await ratingRepo.findStoreById(storeId);
  if (!store) {
    throw new AppError('NOT_FOUND', 404, 'Store not found');
  }

  return ratingRepo.upsertRating(userId, storeId, rating);
};

module.exports = { submitOrUpdateRating };
