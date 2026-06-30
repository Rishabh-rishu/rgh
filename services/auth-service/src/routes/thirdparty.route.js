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
} from "../controllers/thirdPartyServiceAuth.controller.js";
import { verifyThirdPartyToken } from "../middlewares/auth.middleware.js";
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
  verifyThirdPartyToken,
viewProfile,
  
);

router.post(
  "/change-password",
verifyThirdPartyToken,
changePassword,
  
);

router.post(
  "/logout",
  verifyThirdPartyToken,
  logout
);


export default router;