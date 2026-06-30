import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ThirdParty from "../models/thirdparty.model.js";

const OTP = "123456";

const ACCESS_TOKEN_EXPIRES_IN = "7d";
const OTP_TOKEN_EXPIRES_IN = "10m";
const RESET_TOKEN_EXPIRES_IN = "15m";

/* ---------------- JWT Helpers ---------------- */

const signToken = (payload, expiresIn) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is not configured");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
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
      phoneNumber: user.phoneNumber,
      otp: OTP,
      flow: "forgot-password",
    },
    OTP_TOKEN_EXPIRES_IN
  );

const createResetPasswordToken = (decoded) =>
  signToken(
    {
      id: decoded.id,
    },
    RESET_TOKEN_EXPIRES_IN
  );

const verifyForgotPasswordOtp = ({
  accessToken,
  otp,
}) => {
  const decoded = verifyToken(accessToken);

  if (decoded.flow !== "forgot-password") {
    throw new Error("Invalid token");
  }

  if (String(decoded.otp) !== String(otp)) {
    throw new Error("Invalid OTP");
  }

  return createResetPasswordToken(decoded);
};

/* ---------------- Login ---------------- */

export const thirdPartyRegister = async ({
  firstName,
  lastName,
  firstNameArabic,
  lastNameArabic,
  email,
  countryCode,
  phoneNumber,
  password,
  fullAddress,
  location,
  ownerImage,
  idProof,
  businessIdImage,
  businessImage,
  category,
  serviceName,
  experience,
  address,
  descriptionEnglish,
  descriptionArabic,
  isFeatured,
}) => {
  // Check phone number
  const existingPhone = await ThirdParty.findOne({
    where: {
      phoneNumber,
      countryCode,
      isDeleted: false,
    },
  });

  if (existingPhone) {
    throw new Error("Phone number already registered");
  }

  // Check email
  if (email) {
    const existingEmail = await ThirdParty.findOne({
      where: {
        email,
        isDeleted: false,
      },
    });

    if (existingEmail) {
      throw new Error("Email already registered");
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create record
  const thirdParty = await ThirdParty.create({
    firstName,
    lastName,
    firstNameArabic,
    lastNameArabic,
    email,
    countryCode,
    phoneNumber,
    password: hashedPassword,

    fullAddress,
    location,
    ownerImage,
    idProof,
    businessIdImage,
    businessImage,

    category,
    serviceName,
    experience,
    address,
    descriptionEnglish,
    descriptionArabic,
    isFeatured: isFeatured ?? false,

    status: "ACTIVE",
    isDeleted: false,
  });

  return {
    thirdPartyId: thirdParty.id,
    firstName: thirdParty.firstName,
    lastName: thirdParty.lastName,
    email: thirdParty.email,
    phoneNumber: thirdParty.phoneNumber,
    category: thirdParty.category,
    serviceName: thirdParty.serviceName,
    status: thirdParty.status,
  };
};
export const thirdPartyLogin = async ({
  phoneNumber,
  countryCode,
  password,
}) => {
  if (!phoneNumber) {
    throw new Error("Phone number is required");
  }

  if (!countryCode) {
    throw new Error("Country code is required");
  }

  const thirdParty = await ThirdParty.findOne({
    where: {
      phoneNumber,
      countryCode,
      isDeleted: false,
      status: "ACTIVE",
    },
  });

  if (!thirdParty) {
    throw new Error("Third party not found");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    thirdParty.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = signToken(
    {
      id: thirdParty.id,
      phoneNumber: thirdParty.phoneNumber,
    },
    ACCESS_TOKEN_EXPIRES_IN
  );

  await thirdParty.update({
    accessToken,
  });

  return {
    thirdPartyId: thirdParty.id,
    firstName: thirdParty.firstName,
    lastName: thirdParty.lastName,
    countryCode: thirdParty.countryCode,
    phoneNumber: thirdParty.phoneNumber,
    accessToken,
  };
};

/* ---------------- Forgot Password ---------------- */

export const thirdPartyForgotPassword = async ({
  phoneNumber,
  countryCode,
}) => {
  const thirdParty = await ThirdParty.findOne({
    where: {
      phoneNumber,
      countryCode,
      isDeleted: false,
      status: "ACTIVE",
    },
  });

  if (!thirdParty) {
    throw new Error("Third party not found");
  }

  const accessToken =
    createForgotPasswordToken(thirdParty);

  await thirdParty.update({
    accessToken,
    otp: OTP,
    otpExpiryTime: Date.now() + 60 * 1000,
  });

  return {
    accessToken,
  };
};

/* ---------------- Verify OTP ---------------- */

export const thirdPartyVerifyForgotPasswordOtp =
  async ({ accessToken, otp }) => {
    const resetToken =
      verifyForgotPasswordOtp({
        accessToken,
        otp,
      });

    const thirdParty =
      await ThirdParty.findOne({
        where: {
          accessToken,
        },
      });

    if (!thirdParty) {
      throw new Error("Third party not found");
    }

    if (
      String(thirdParty.otp) !== String(otp)
    ) {
      throw new Error("Invalid OTP");
    }

    if (
      Number(thirdParty.otpExpiryTime) <
      Date.now()
    ) {
      throw new Error("OTP expired");
    }

    return {
      resetToken,
    };
  };

/* ---------------- Resend OTP ---------------- */

export const thirdPartyResendOtp = async ({
  accessToken,
}) => {
  const decoded = verifyToken(accessToken);

  const thirdParty =
    await ThirdParty.findOne({
      where: {
        id: decoded.id,
        accessToken,
      },
    });

  if (!thirdParty) {
    throw new Error("Third party not found");
  }

  const otp = OTP;

  await thirdParty.update({
    otp,
    otpExpiryTime: Date.now() + 60 * 1000,
  });

  // Send SMS here

  return {
    accessToken,
  };
};

/* ---------------- Reset Password ---------------- */

export const thirdPartyResetPassword =
  async ({
    resetToken,
    password,
    confirmPassword,
  }) => {
    const decoded =
      verifyToken(resetToken);

    const thirdParty =
      await ThirdParty.findOne({
        where: {
          id: decoded.id,
        },
      });

    if (!thirdParty) {
      throw new Error("Third party not found");
    }

    if (password !== confirmPassword) {
      throw new Error(
        "Passwords do not match"
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await thirdParty.update({
      password: hashedPassword,
      accessToken: null,
      otp: null,
      otpExpiryTime: null,
    });

    return {
      thirdPartyId: thirdParty.id,
    };
  };


  export const thirdPartyChangePassword = async ({
  thirdPartyId,
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  const thirdParty = await ThirdParty.findOne({
    where: {
      id: thirdPartyId,
      isDeleted: false,
      status: "ACTIVE",
    },
  });

  if (!thirdParty) {
    throw new Error("Third party not found");
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    thirdParty.password
  );

  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // Prevent same password
  const isSamePassword = await bcrypt.compare(
    newPassword,
    thirdParty.password
  );

  if (isSamePassword) {
    throw new Error(
      "New password cannot be the same as current password"
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await thirdParty.update({
    password: hashedPassword,
  });

  return {};
};

export const getThirdPartyProfile = async (thirdPartyId) => {
  const thirdParty = await ThirdParty.findOne({
    where: {
      id: thirdPartyId,
      isDeleted: false,
      status: "ACTIVE",
    },
    attributes: {
      exclude: [
        "password",
        "accessToken",
        "otp",
        "otpExpiryTime",
      ],
    },
  });

  if (!thirdParty) {
    throw new Error("Third party not found");
  }

  return thirdParty;
};

export const thirdPartyLogout = async (thirdPartyId) => {
  const thirdParty = await ThirdParty.findOne({
    where: {
      id: thirdPartyId,
      isDeleted: false,
    },
  });

  if (!thirdParty) {
    throw new Error("Third party not found");
  }

  await thirdParty.update({
    accessToken: null,
  });

  return {};
};