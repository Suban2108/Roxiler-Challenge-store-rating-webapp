const { z } = require('zod');

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

const nameSchema = z
  .string()
  .min(20, 'Name must be at least 20 characters')
  .max(60, 'Name must not exceed 60 characters');

const addressSchema = z
  .string()
  .max(400, 'Address must not exceed 400 characters');

const emailSchema = z.string().email('Invalid email address');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must not exceed 16 characters')
  .regex(
    PASSWORD_REGEX,
    'Password must include at least one uppercase letter and one special character'
  );

const roleSchema = z.enum(['admin', 'user', 'store_owner']);

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.string().optional(),
  dir: z.enum(['asc', 'desc']).default('asc'),
});

module.exports = {
  PASSWORD_REGEX,
  nameSchema,
  addressSchema,
  emailSchema,
  passwordSchema,
  roleSchema,
  paginationSchema,
};
