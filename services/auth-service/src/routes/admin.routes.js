import express from "express";
import shared from "@rgh/shared";
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  verifyForgotPasswordOtp,
} from "../controllers/admin.controller.js";
import {
  adminLoginValidator,
  forgotPasswordValidator,
  otpValidator,
  resetPasswordValidator,
} from "../validators/auth.validator.js";

const { authenticate, authorize } = shared;
const router = express.Router();

router.post("/login", adminLoginValidator, login);
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);
router.post("/verify-forgot-password-otp", otpValidator, verifyForgotPasswordOtp);
router.post("/reset-password", resetPasswordValidator, resetPassword);
router.post("/logout", authenticate, authorize("admin"), logout);

export default router;
