const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../lib/db');
const { AppError } = require('@rgh/shared');

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

function generateTokens(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role.roleName,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  return { accessToken, refreshToken, expiresAt };
}

async function login(email, password) {
  const user = await db.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user || user.status !== 'active') {
    throw new AppError('Invalid credentials', 401);
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const tokens = generateTokens(user);

  await db.refreshToken.create({
    data: {
      userId: user.id,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.roleName,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

async function logout(refreshToken) {
  await db.refreshToken.deleteMany({ where: { refreshToken } });
}

async function forgotPassword(email) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('If the email exists, an OTP has been sent', 200);
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  await db.otpVerification.create({
    data: { identifier: email, otpCode, purpose: 'reset_password', expiresAt },
  });

  return { message: 'OTP sent successfully', otpCode };
}

async function verifyOtp(identifier, otpCode, purpose) {
  const otp = await db.otpVerification.findFirst({
    where: { identifier, otpCode, purpose, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  return { verified: true };
}

async function resetPassword(email, otpCode, newPassword) {
  await verifyOtp(email, otpCode, 'reset_password');

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.user.update({
    where: { email },
    data: { passwordHash },
  });

  await db.otpVerification.deleteMany({
    where: { identifier: email, purpose: 'reset_password' },
  });
}

async function refreshAccessToken(refreshToken) {
  const stored = await db.refreshToken.findUnique({
    where: { refreshToken },
    include: { user: { include: { role: true } } },
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const tokens = generateTokens(stored.user);

  await db.refreshToken.delete({ where: { id: stored.id } });
  await db.refreshToken.create({
    data: {
      userId: stored.userId,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
    },
  });

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

async function validateRole(userId, requiredRole) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return { valid: user.role.roleName === requiredRole, role: user.role.roleName };
}

module.exports = {
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  refreshAccessToken,
  validateRole,
};
