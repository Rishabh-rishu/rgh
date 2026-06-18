const express = require('express');
const { success } = require('@rgh/shared');
const { authenticate } = require('@rgh/shared');
const authService = require('../services/authService');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return success(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return success(res, null, 'Logout successful');
  } catch (err) {
    next(err);
  }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return success(res, result, 'OTP sent');
  } catch (err) {
    next(err);
  }
});

router.post('/verify-otp', async (req, res, next) => {
  try {
    const { identifier, otpCode, purpose } = req.body;
    const result = await authService.verifyOtp(identifier, otpCode, purpose);
    return success(res, result, 'OTP verified');
  } catch (err) {
    next(err);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { email, otpCode, newPassword } = req.body;
    await authService.resetPassword(email, otpCode, newPassword);
    return success(res, null, 'Password reset successful');
  } catch (err) {
    next(err);
  }
});

router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    return success(res, result, 'Token refreshed');
  } catch (err) {
    next(err);
  }
});

router.get('/validate-role/:role', authenticate, async (req, res, next) => {
  try {
    const result = await authService.validateRole(req.user.id, req.params.role);
    return success(res, result);
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticate, async (req, res) => {
  return success(res, req.user);
});

module.exports = router;
