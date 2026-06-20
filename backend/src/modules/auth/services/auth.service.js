const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const AppError = require('../../../errors/AppError');
const authRepo = require('../repositories/auth.repository');

const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpires }
  );

const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user.id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpires }
  );

const register = async (data) => {
  const existing = await authRepo.findByEmail(data.email);
  if (existing) {
    throw new AppError('EMAIL_EXISTS', 409, 'Email already registered');
  }

  const email = data.email.toLowerCase();

  const passwordHash = await bcrypt.hash(data.password, config.bcryptRounds);
  const user = await authRepo.createUser({
    name: data.name,
    email,
    passwordHash,
    address: data.address,
    role: 'user',
  });

  return user;
};

const login = async (email, password) => {
  const user = await authRepo.findByEmail(email);
  if (!user) {
    throw new AppError('INVALID_CREDENTIALS', 401, 'Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new AppError('INVALID_CREDENTIALS', 401, 'Invalid credentials');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const decoded = jwt.decode(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);
  await authRepo.saveRefreshToken(user.id, refreshToken, expiresAt);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (refreshToken) => {
  const stored = await authRepo.findRefreshToken(refreshToken);
  if (!stored) {
    throw new AppError('INVALID_TOKEN', 401, 'Invalid refresh token');
  }

  try {
    jwt.verify(refreshToken, config.jwt.refreshSecret);
  } catch {
    await authRepo.deleteRefreshToken(refreshToken);
    throw new AppError('INVALID_TOKEN', 401, 'Invalid refresh token');
  }

  const user = await authRepo.findById(stored.user_id);
  if (!user) {
    throw new AppError('INVALID_TOKEN', 401, 'Invalid refresh token');
  }

  const accessToken = generateAccessToken(user);
  return { accessToken, user };
};

const logout = async (refreshToken) => {
  if (refreshToken) {
    await authRepo.deleteRefreshToken(refreshToken);
  }
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await authRepo.findById(userId);
  if (!user) {
    throw new AppError('NOT_FOUND', 404, 'User not found');
  }

  const fullUser = await authRepo.findByEmail(user.email);
  const isValid = await bcrypt.compare(currentPassword, fullUser.password_hash);
  if (!isValid) {
    throw new AppError('INVALID_CREDENTIALS', 401, 'Current password is incorrect');
  }

  const passwordHash = await bcrypt.hash(newPassword, config.bcryptRounds);
  await authRepo.updatePassword(userId, passwordHash);
  await authRepo.deleteAllRefreshTokens(userId);
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  changePassword,
};
