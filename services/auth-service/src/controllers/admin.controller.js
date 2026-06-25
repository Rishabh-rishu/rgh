import shared from "@rgh/shared";
import {
  adminLogin as adminLoginService,
  forgotPassword as forgotPasswordService,
  logout as logoutService,
  resetPassword as resetPasswordService,
  verifyForgotPasswordOtpService,
} from "../services/auth.service.js";
import { getTokenFromAuthorizationHeader } from "../utils/jwt.js";

const { HTTP_STATUS, sendErrorResponse, sendSuccessResponse } = shared;

const requireAuthToken = (req, res) => {
  const token = getTokenFromAuthorizationHeader(req.headers.authorization);

  if (!token) {
    sendErrorResponse(res, HTTP_STATUS.UNAUTHORIZED, "Authorization token missing");
    return null;
  }

  return token;
};

export const login = async (req, res) => {
  try {
    const result = await adminLoginService(req.body);
    return sendSuccessResponse(res, HTTP_STATUS.OK, "Admin logged in successfully", result);
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body);
    return sendSuccessResponse(res, HTTP_STATUS.OK, "OTP sent successfully", result);
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
};

export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const accessToken = requireAuthToken(req, res);
    if (!accessToken) return null;

    const result = await verifyForgotPasswordOtpService({
      accessToken,
      otp: req.body.otp,
    });

    return sendSuccessResponse(res, HTTP_STATUS.OK, "OTP verified successfully", result);
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const resetToken = requireAuthToken(req, res);
    if (!resetToken) return null;

    const result = await resetPasswordService({
      resetToken,
      password: req.body.password,
    });

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Password reset successfully", result);
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
};

export const logout = async (req, res) => {
  try {
    await logoutService(req.user.id);
    return sendSuccessResponse(res, HTTP_STATUS.OK, "Logged out successfully");
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};
