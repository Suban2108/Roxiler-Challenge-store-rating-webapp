const authService = require('../services/auth.service');
const { sendSuccess } = require('../../../utils/response');
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  refreshTokenSchema,
} = require('../validators/auth.validator');

const register = async (req, res) => {
  const data = registerSchema.parse(req.body);
  const user = await authService.register(data);
  sendSuccess(res, { user }, 'Registration successful', 201);
};

const login = async (req, res) => {
  const data = loginSchema.parse(req.body);
  const result = await authService.login(data.email, data.password);
  sendSuccess(res, result, 'Login successful');
};

const refresh = async (req, res) => {
  const data = refreshTokenSchema.parse(req.body);
  const result = await authService.refreshAccessToken(data.refreshToken);
  sendSuccess(res, result, 'Token refreshed');
};

const logout = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  await authService.logout(refreshToken);
  sendSuccess(res, {}, 'Logged out successfully');
};

const changePassword = async (req, res) => {
  const data = changePasswordSchema.parse(req.body);
  await authService.changePassword(
    req.user.id,
    data.currentPassword,
    data.newPassword
  );
  sendSuccess(res, {}, 'Password updated successfully');
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  changePassword,
};
