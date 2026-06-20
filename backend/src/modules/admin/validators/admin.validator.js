const { z } = require('zod');
const {
  nameSchema,
  emailSchema,
  passwordSchema,
  addressSchema,
  roleSchema,
  paginationSchema,
} = require('../../../utils/validators');

const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  address: addressSchema,
  role: roleSchema,
});

const createStoreSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  ownerId: z.coerce.number().int().positive('Owner ID is required'),
});

const optionalFilterString = z
  .string()
  .optional()
  .transform((val) => (val === '' ? undefined : val));

const userListQuerySchema = paginationSchema.extend({
  name: optionalFilterString,
  email: optionalFilterString,
  address: optionalFilterString,
  role: z.preprocess(
    (val) => (val === '' ? undefined : val),
    roleSchema.optional()
  ),
});

const storeListQuerySchema = paginationSchema.extend({
  name: optionalFilterString,
  email: optionalFilterString,
  address: optionalFilterString,
});

module.exports = {
  createUserSchema,
  createStoreSchema,
  userListQuerySchema,
  storeListQuerySchema,
};
