import shared from "@rgh/shared";
import {
  tenantForgotPassword,
  tenantLogin,
  tenantResetPassword,
  tenantVerifyForgotPasswordOtp,
  verifyTenantLoginOtp,
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
    const result = await tenantLogin(req.body);
    return sendSuccessResponse(res, HTTP_STATUS.OK, "OTP sent successfully", result);
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
};

export const verifyLoginOtp = async (req, res) => {
  try {
    const accessToken = requireAuthToken(req, res);
    if (!accessToken) return null;

    const result = await verifyTenantLoginOtp({
      accessToken,
      otp: req.body.otp,
    });

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Login successful", result);
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const result = await tenantForgotPassword(req.body);
    return sendSuccessResponse(res, HTTP_STATUS.OK, "OTP sent successfully", result);
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
};

export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const accessToken = requireAuthToken(req, res);
    if (!accessToken) return null;

    const result = await tenantVerifyForgotPasswordOtp({
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

    const result = await tenantResetPassword({
      resetToken,
      password: req.body.password,
    });

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Password reset successfully", result);
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
};
