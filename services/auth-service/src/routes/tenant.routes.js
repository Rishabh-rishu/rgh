import express from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  verifyForgotPasswordOtp,
  changePassword,
   viewProfile,
   updateTenantProfile
} from "../controllers/tenant.controller.js";
import {
  forgotPasswordValidator,
  otpValidator,
  resetPasswordValidator,
  tenantLoginValidator,
 
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/login", login);
router.post("/change-password", changePassword );
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password-otp", otpValidator, verifyForgotPasswordOtp);
router.post("/reset-password", resetPassword);
router.get("/profile",viewProfile)
router.put("/update-profile",updateTenantProfile)

export default router;
