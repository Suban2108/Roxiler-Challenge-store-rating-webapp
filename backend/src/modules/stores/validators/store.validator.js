const { z } = require('zod');
const { paginationSchema } = require('../../../utils/validators');

const storeSearchSchema = paginationSchema.extend({
  name: z.string().optional(),
  address: z.string().optional(),
});

const ratingSchema = z.object({
  storeId: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().min(1).max(5),
});

module.exports = { storeSearchSchema, ratingSchema };
