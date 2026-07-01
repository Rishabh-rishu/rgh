import shared from "@rgh/shared";
import {
  thirdPartyLogin,
  thirdPartyForgotPassword,
  thirdPartyVerifyForgotPasswordOtp,
  thirdPartyResetPassword,
  thirdPartyResendOtp,
  thirdPartyRegister,
  thirdPartyChangePassword,
  getThirdPartyProfile,
  thirdPartyLogout
} from "../services/thirdPartyServiceAuth.service.js";

import { getTokenFromAuthorizationHeader } from "../utils/jwt.js";

const { HTTP_STATUS, sendErrorResponse, sendSuccessResponse } = shared;

const requireAuthToken = (req, res) => {
  const token = getTokenFromAuthorizationHeader(req.headers.authorization);

  if (!token) {
    sendErrorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      "Authorization token missing"
    );
    return null;
  }

  return token;
};

/* ---------------- Login ---------------- */
export const register = async (req, res) => {
  try {
    const result = await thirdPartyRegister(req.body);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.CREATED,
      "Third party registered successfully",
      result
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};
export const login = async (req, res) => {
  try {
    const result = await thirdPartyLogin(req.body);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Third party logged in successfully",
      result
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

/* ---------------- Forgot Password ---------------- */

export const forgotPassword = async (req, res) => {
  try {
    const result = await thirdPartyForgotPassword(req.body);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "OTP sent successfully",
      result
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

/* ---------------- Verify Forgot Password OTP ---------------- */

export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const accessToken = requireAuthToken(req, res);
    if (!accessToken) return;

    const result =
      await thirdPartyVerifyForgotPasswordOtp({
        accessToken,
        otp: req.body.otp,
      });

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "OTP verified successfully",
      result
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

/* ---------------- Resend OTP ---------------- */

export const resendOtp = async (req, res) => {
  try {
    const accessToken = requireAuthToken(req, res);
    if (!accessToken) return;

    const result = await thirdPartyResendOtp({
      accessToken,
    });

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "OTP resent successfully",
      result
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

/* ---------------- Reset Password ---------------- */

export const resetPassword = async (req, res) => {
  try {
    const resetToken = requireAuthToken(req, res);
    if (!resetToken) return;

    const result = await thirdPartyResetPassword({
      resetToken,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Password reset successfully",
      result
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};



export const changePassword = async (req, res) => {
  try {
    const result = await thirdPartyChangePassword({
      // After auth middleware
      thirdPartyId: req.user.id,

      // Temporary
      // thirdPartyId: "YOUR_THIRD_PARTY_ID",

      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword,
    });

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Password changed successfully",
      result
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};



export const viewProfile = async (req, res) => {
  try {
    const result = await getThirdPartyProfile(req.thirdParty.id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Profile fetched successfully",
      result
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const logout = async (req, res) => {
  try {
    const result = await thirdPartyLogout(req.thirdParty.id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Logged out successfully",
      result
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};