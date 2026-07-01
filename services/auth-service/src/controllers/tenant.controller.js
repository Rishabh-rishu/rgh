import shared from "@rgh/shared";
import {
  tenantForgotPassword,
  tenantLogin,
  tenantResetPassword,
  tenantVerifyForgotPasswordOtp,
  tenantChangePassword,
  getTenantProfile,
 updateTenantProfiles
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
   
    return sendSuccessResponse(res, HTTP_STATUS.OK, "Tenant logged in successfully", result);
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
};

export const changePassword  = async (req, res) => {
  try {
    console.log(req.user)
      const result = await tenantChangePassword({
      // tenantId: req.id, // From auth middleware
      tenantId:"2447f71e-b532-47d1-be91-66b4f3e09b43",
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Password changed successfully",);
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
      confirmPassword:req.body.confirmPassword
    });

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Password reset successfully", result);
  } catch (error) {
    return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
};

export const viewProfile = async (req, res) => {
  try {
    const accessToken = requireAuthToken(req, res);
    if (!accessToken) return null;

    const result = await getTenantProfile(accessToken);

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

export const updateTenantProfile = async (req, res) => {
  try {
     
     const updateProData = req.body;
     const TenantId = "ebc2215e-c96b-4b6d-a91e-1adf3bb2ed76"


    const tenant = await updateTenantProfiles(
       TenantId, // From auth middleware
       updateProData
    );

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Tenant profile updated successfully",
      tenant
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};