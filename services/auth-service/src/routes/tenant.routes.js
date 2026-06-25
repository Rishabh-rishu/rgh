import express from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  verifyForgotPasswordOtp,
  verifyLoginOtp,
} from "../controllers/tenant.controller.js";
import {
  forgotPasswordValidator,
  otpValidator,
  resetPasswordValidator,
  tenantLoginValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/login", tenantLoginValidator, login);
router.post("/verify-login-otp", otpValidator, verifyLoginOtp);
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);
router.post("/verify-forgot-password-otp", otpValidator, verifyForgotPasswordOtp);
router.post("/reset-password", resetPasswordValidator, resetPassword);

export default router;
