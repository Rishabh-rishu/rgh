
const authService = require('../services/auth.service');
const {sendErrorResponse,sendSuccessResponse} = require("../utils/response")
const {HTTP_STATUS} = require("../utils/httpStatus")

// admin Controller 
 const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.adminLogin({
      email,
      password,
    });

    return sendSuccessResponse(
      res,
       HTTP_STATUS.OK,
      "Admin logged in successfully",
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

 const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await authService.forgotPassword({
      email,
    });

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

const verifyForgotPasswordOtp = async (
  req,
  res
) => {
 try {
    const authHeader = req.headers.authorization;
  

    if (!authHeader ) {
      return 
       return sendErrorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      "Authorization token missing"
    );
    }

    const accessToken = authHeader
    const { otp } = req.body;

    if (!otp) {
      return
         return 
       return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      "OTP is required"
    );
    }

    const result = await authService.verifyForgotPasswordOtpService({
      accessToken,
      otp,
    });

    return 
    sendErrorResponse(
      res,
      HTTP_STATUS.BAD.OK,
      "OTP verified successfully",
      result
    );
  
  } catch (error) {
    return

    sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

 const resetPassword = async (
  req,
  res
) => {
    try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token missing",
      });
    }

    const resetToken = authHeader;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const result = await authService.resetPassword({
      resetToken,
      password,
    });

    return res.status(200).json({
      message: "Password reset successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

 const logout = async (req, res) => {
  try {
    const adminId = req.user.id;

    await authService.logout(adminId);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Logged out successfully"
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// Tanant Controller

 const tanantLogin = async (req, res) => {
  try {
    const { identifier } =
      req.body;

    const result =
      await authService.tenantLogin({
        identifier
      });

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

const verifyLoginOtp = async (
  req,
  res
) => {
  try {

     const authHeader = req.headers.authorization;
  

    if (!authHeader ) {
      return 
       return sendErrorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      "Authorization token missing"
    );
    }

    const accessToken = authHeader

    const { otp } = req.body;

    const result =
      await authService.verifyTenantLoginOtp({
        accessToken,
        otp,
      });

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Login successful",
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

const TenantForgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

     console.log(email)
    const result =
      await authService.tenantForgotPassword({
        email
      });

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

const TenantResetPassword = async (
  req,
  res
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token missing",
      });
    }

    const resetToken = authHeader;

    const { password } =
      req.body;

    const result =
      await authService.tenantResetPassword({
        resetToken,
        password,
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




module.exports = {

  adminLogin,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
  logout,
  // Tanant Auth
  tanantLogin,
  verifyLoginOtp,
  TenantForgotPassword,
  TenantResetPassword

};