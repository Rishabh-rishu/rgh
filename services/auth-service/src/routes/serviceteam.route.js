import express from "express";
import shared from "@rgh/shared";
import {
    register,
  login,
  forgotPassword,
  verifyForgotPasswordOtp,
  resendOtp,
  resetPassword,
  viewProfile,
  changePassword,
  logout
} from "../controllers/serviceTeamAuth.controller.js";
import { verifyServiceTeamToken } from "../middlewares/auth.middleware.js";
// import {
//   thirdPartyLoginValidator,
//   forgotPasswordValidator,
//   otpValidator,
//   resetPasswordValidator,
// } from "../validators/auth.validator.js";

// const { authenticate } = shared;

const router = express.Router();
router.post("/register", register);

router.post("/login", login);

router.post(
  "/forgot-password",
//   forgotPasswordValidator,
  forgotPassword
);

router.post(
  "/verify-forgot-password-otp",
//   otpValidator,
  verifyForgotPasswordOtp
);

router.post(
  "/resend-otp",
  resendOtp
);

router.post(
  "/reset-password",
//   resetPasswordValidator,
  resetPassword
);

router.post(
  "/reset-password",
//   resetPasswordValidator,
  resetPassword
);

router.get(
  "/view-profile",
  verifyServiceTeamToken,
viewProfile,
  
);

router.post(
  "/change-password",
verifyServiceTeamToken,
changePassword,
  
);

router.post(
  "/logout",
  verifyServiceTeamToken,
  logout
);


export default router;