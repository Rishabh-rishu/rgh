import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import User from "../models/auth.model.js";

const OTP = "123456";
const ACCESS_TOKEN_EXPIRES_IN = "7d";
const OTP_TOKEN_EXPIRES_IN = "10m";
const RESET_TOKEN_EXPIRES_IN = "15m";

const signToken = (payload, expiresIn) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is not configured");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is not configured");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

const createForgotPasswordToken = (user) =>
  signToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      otp: OTP,
      flow: "forgot-password",
    },
    OTP_TOKEN_EXPIRES_IN
  );

const createResetPasswordToken = (decoded) =>
  signToken(
    {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      flow: "reset-password",
    },
    RESET_TOKEN_EXPIRES_IN
  );

const verifyForgotPasswordOtp = ({ accessToken, otp, role }) => {
  const decoded = verifyToken(accessToken);

  if (decoded.flow !== "forgot-password" || decoded.role !== role) {
    throw new Error("Invalid token flow");
  }

  if (String(decoded.otp) !== String(otp)) {
    throw new Error("Invalid OTP");
  }

  return createResetPasswordToken(decoded);
};

const resetUserPassword = async ({ resetToken, password, role }) => {
  const decoded = verifyToken(resetToken);

  if (decoded.flow !== "reset-password" || decoded.role !== role) {
    throw new Error("Invalid token flow");
  }

  const user = await User.findOne({
    where: {
      id: decoded.id,
      role,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await user.update({
    passwordHash,
    accessToken: null,
  });

  return {
    id: user.id,
    email: user.email,
  };
};

export const adminLogin = async ({ email, password }) => {
  const admin = await User.findOne({
    where: {
      email,
      role: "admin",
    },
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  if (admin.isBlocked) {
    throw new Error("Admin is blocked");
  }

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const accessToken = signToken(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    ACCESS_TOKEN_EXPIRES_IN
  );

  await admin.update({ accessToken });

  return {
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
    accessToken,
  };
};

export const forgotPassword = async ({ email }) => {
  const admin = await User.findOne({
    where: {
      email,
      role: "admin",
    },
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  if (admin.isBlocked) {
    throw new Error("Admin is blocked");
  }

  const accessToken = createForgotPasswordToken(admin);

  await admin.update({ accessToken });

  return { accessToken };
};

export const verifyForgotPasswordOtpService = async ({ accessToken, otp }) => {
  const resetToken = verifyForgotPasswordOtp({
    accessToken,
    otp,
    role: "admin",
  });

  return { resetToken };
};

export const resetPassword = async ({ resetToken, password }) =>
  resetUserPassword({
    resetToken,
    password,
    role: "admin",
  });

export const logout = async (adminId) => {
  const admin = await User.findOne({
    where: {
      id: adminId,
      role: "admin",
    },
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  await admin.update({ accessToken: null });

  return true;
};

export const tenantLogin = async ({ identifier }) => {
  const tenant = await User.findOne({
    where: {
      role: "tenant",
      [Op.or]: [
        {
          email: identifier,
        },
        {
          phone: identifier,
        },
      ],
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  if (tenant.isBlocked) {
    throw new Error("Tenant is blocked");
  }

  const accessToken = signToken(
    {
      id: tenant.id,
      otp: OTP,
      role: tenant.role,
      flow: "tenant-login",
    },
    OTP_TOKEN_EXPIRES_IN
  );

  await tenant.update({ accessToken });

  return { accessToken };
};

export const verifyTenantLoginOtp = async ({ accessToken, otp }) => {
  const decoded = verifyToken(accessToken);

  if (decoded.flow !== "tenant-login" || decoded.role !== "tenant") {
    throw new Error("Invalid token");
  }

  if (String(decoded.otp) !== String(otp)) {
    throw new Error("Invalid OTP");
  }

  const tenant = await User.findOne({
    where: {
      id: decoded.id,
      role: "tenant",
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  const loginToken = signToken(
    {
      id: tenant.id,
      email: tenant.email,
      role: tenant.role,
    },
    ACCESS_TOKEN_EXPIRES_IN
  );

  await tenant.update({ accessToken: loginToken });

  return {
    tenantId: tenant.id,
    email: tenant.email,
    role: tenant.role,
    accessToken: loginToken,
  };
};

export const tenantForgotPassword = async ({ email }) => {
  const tenant = await User.findOne({
    where: {
      email,
      role: "tenant",
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  if (tenant.isBlocked) {
    throw new Error("Tenant is blocked");
  }

  const accessToken = createForgotPasswordToken(tenant);

  await tenant.update({ accessToken });

  return { accessToken };
};

export const tenantVerifyForgotPasswordOtp = async ({ accessToken, otp }) => {
  const resetToken = verifyForgotPasswordOtp({
    accessToken,
    otp,
    role: "tenant",
  });

  return { resetToken };
};

export const tenantResetPassword = async ({ resetToken, password }) =>
  resetUserPassword({
    resetToken,
    password,
    role: "tenant",
  });
