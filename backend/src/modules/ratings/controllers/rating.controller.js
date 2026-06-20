const ratingService = require('../services/rating.service');
const { sendSuccess } = require('../../../utils/response');
const { ratingSchema } = require('../../stores/validators/store.validator');

const submitRating = async (req, res) => {
  const data = ratingSchema.parse(req.body);
  const rating = await ratingService.submitOrUpdateRating(
    req.user.id,
    data.storeId,
    data.rating
  );
  sendSuccess(res, { rating }, 'Rating submitted successfully', 201);
};

const updateRating = async (req, res) => {
  const data = ratingSchema.parse({
    storeId: req.params.storeId,
    rating: req.body.rating,
  });
  const rating = await ratingService.submitOrUpdateRating(
    req.user.id,
    data.storeId,
    data.rating
  );
  sendSuccess(res, { rating }, 'Rating updated successfully');
};

module.exports = { submitRating, updateRating };
