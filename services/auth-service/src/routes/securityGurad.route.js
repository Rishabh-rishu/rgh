import express from "express";
import {
 
  login,
  verifyLoginOtp,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword

} from "../controllers/securityGaurd.controller.js";
import {
  forgotPasswordValidator,
  otpValidator,
  resetPasswordValidator,
  tenantLoginValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/login", login);
router.post("/verify-login-otp", otpValidator, verifyLoginOtp);
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);
router.post("/verify-forgot-password-otp", otpValidator, verifyForgotPasswordOtp);
router.post("/reset-password", resetPasswordValidator, resetPassword);

export default router;
