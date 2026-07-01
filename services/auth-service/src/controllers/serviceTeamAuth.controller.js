import shared from "@rgh/shared";
import {
  employeeLogin,
  staffForgotPassword,
  staffVerifyForgotPasswordOtp,
  staffResetPassword,
  staffResendOtp,
  serviceTeamRegister,
  staffChangePassword,
  getStaffProfile,
  staffLogout
} from "../services/serviceTeamAuth.service.js";

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
    console.log("register",register)
    const result = await serviceTeamRegister(req.body);

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
    const result = await employeeLogin(req.body);

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
    const result = await staffForgotPassword(req.body);

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
      await staffVerifyForgotPasswordOtp({
         role:req.body.role,
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

    const result = await staffResendOtp({
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

    const result = await staffResetPassword({
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
    const result = await staffChangePassword({
      // After auth middleware
      serviceTeamId: req.user.id,

      // Temporary
      // serviceTeamId: "YOUR_THIRD_PARTY_ID",

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
    const result = await getStaffProfile({
      staffId: req.serviceTeam.id,
      role: req.serviceTeam.role,
    });

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
    const result = await staffLogout({
      staffId: req.serviceTeam.id,
      role: req.serviceTeam.role,
    });

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