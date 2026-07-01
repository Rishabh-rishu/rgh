import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ServiceTeam from "../models/serviceTeam.model.js";
import SecurityGuard from "../models/security.gaurd.model.js";

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

export const serviceTeamRegister = async ({
  propertyId,
  categoryId,
  serviceIds,
  serviceMemberId,
  profileImage,
  firstNameEnglish,
  firstNameArabic,
  lastNameEnglish,
  lastNameArabic,
  email,
  countryCode,
  contactNumber,
  password,
}) => {
  const existingMember = await ServiceTeam.findOne({
    where: {
      serviceMemberId,
      isDeleted: false,
    },
  });

  if (existingMember) {
    throw new Error("Service Member ID already exists");
  }

  const existingEmail = await ServiceTeam.findOne({
    where: {
      email,
      isDeleted: false,
    },
  });

  if (existingEmail) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const serviceTeam = await ServiceTeam.create({
    propertyId,
    categoryId,
    serviceIds,
    serviceMemberId,
    profileImage,
    firstNameEnglish,
    firstNameArabic,
    lastNameEnglish,
    lastNameArabic,
    email,
    countryCode,
    contactNumber,
    password: hashedPassword,
    status: "ACTIVE",
    isDeleted: false,
  });

  return {
    id: serviceTeam.id,
    serviceMemberId: serviceTeam.serviceMemberId,
    firstNameEnglish: serviceTeam.firstNameEnglish,
    lastNameEnglish: serviceTeam.lastNameEnglish,
    email: serviceTeam.email,
    contactNumber: serviceTeam.contactNumber,
  };
};
export const employeeLogin = async ({
  employeeId,
  password,
}) => {
  let employee;
  let role;

  // Check Service Team first
  employee = await ServiceTeam.findOne({
    where: {
      serviceMemberId: employeeId,
      isDeleted: false,
    },
  });

  if (employee) {
    role = "service_team";
  } else {
    // Check Security Guard
    employee = await SecurityGuard.findOne({
      where: {
        guardId: employeeId,
        isDeleted: false,
      },
    });

    if (employee) {
      role = "security_guard";
    }
  }

  if (!employee) {
    throw new Error(
      "We couldn’t find an account with these details. Please check and try again."
    );
  }

  if (employee.status !== "ACTIVE") {
    throw new Error(
      "Access to this account is currently restricted.\nPlease contact support for assistance."
    );
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    employee.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = signToken(
    {
      id: employee.id,
      role,
    },
    ACCESS_TOKEN_EXPIRES_IN
  );

  await employee.update({
    accessToken,
  });

  return {
    id: employee.id,
    employeeId,
    role,
    firstName: employee.firstNameEnglish,
    lastName: employee.lastNameEnglish,
    accessToken,
  };
};
/* ---------------- Forgot Password ---------------- */


export const staffForgotPassword = async ({
  contactNumber,
  countryCode,
}) => {
  if (!contactNumber) {
    throw new Error("Contact number is required");
  }

  if (!countryCode) {
    throw new Error("Country code is required");
  }

  let staff;
  let role;

  // Check Service Team first
  staff = await ServiceTeam.findOne({
    where: {
      contactNumber,
      countryCode,
      isDeleted: false,
    },
  });

  if (staff) {
    role = "service_team";
  } else {
    // Check Security Guard
    staff = await SecurityGuard.findOne({
      where: {
        contactNumber,
        countryCode,
        isDeleted: false,
      },
    });

    if (staff) {
      role = "security_guard";
    }
  }

  if (!staff) {
    throw new Error(
      "We couldn’t find an account with these details. Please check and try again."
    );
  }

  if (staff.status !== "ACTIVE") {
    throw new Error(
      "Access to this account is currently restricted.\nPlease contact support for assistance."
    );
  }

  const accessToken = createForgotPasswordToken(staff);

  await staff.update({
    accessToken,
    otp: OTP,
    otpExpiryTime: Date.now() + 60 * 1000,
  });

  // TODO: Send OTP via SMS

  return {
    accessToken,
    role,
  };
};

/* ---------------- Verify OTP ---------------- */

export const staffVerifyForgotPasswordOtp = async ({
  role,
  accessToken,
  otp,
}) => {
  let Model;

  switch (role) {
    case "security_guard":
      Model = SecurityGuard;
      break;

    case "service_team":
      Model = ServiceTeam;
      break;

    default:
      throw new Error("Invalid role");
  }

  const resetToken = verifyForgotPasswordOtp({
    accessToken,
    otp,
  });

  const staff = await Model.findOne({
    where: {
      accessToken,
    },
  });

  if (!staff) {
    throw new Error(
      "We couldn’t find an account with these details. Please check and try again."
    );
  }

  if (String(staff.otp) !== String(otp)) {
    throw new Error("Invalid OTP");
  }

  if (Number(staff.otpExpiryTime) < Date.now()) {
    throw new Error("Your OTP has expired. Please request a new code.");
  }

  return {
    resetToken,
  };
};
/* ---------------- Resend OTP ---------------- */

export const staffResendOtp = async ({
  role,
  accessToken,
}) => {
  let Model;

  switch (role) {
    case "security_guard":
      Model = SecurityGuard;
      break;

    case "service_team":
      Model = ServiceTeam;
      break;

    default:
      throw new Error("Invalid role");
  }

  const decoded = verifyToken(accessToken);

  const staff = await Model.findOne({
    where: {
      id: decoded.id,
      accessToken,
      isDeleted: false,
    },
  });

  if (!staff) {
    throw new Error(
      "We couldn’t find an account with these details. Please check and try again."
    );
  }

  const otp = OTP; // Replace with dynamic OTP generation if needed

  await staff.update({
    otp,
    otpExpiryTime: Date.now() + 60 * 1000,
  });

  // TODO: Send OTP via SMS/Email

  return {
    accessToken,
  };
};
/* ---------------- Reset Password ---------------- */

export const staffResetPassword = async ({
  role,
  resetToken,
  password,
  confirmPassword,
}) => {
  let Model;

  switch (role) {
    case "security_guard":
      Model = SecurityGuard;
      break;

    case "service_team":
      Model = ServiceTeam;
      break;

    default:
      throw new Error("Invalid role");
  }

  const decoded = verifyToken(resetToken);

  const staff = await Model.findOne({
    where: {
      id: decoded.id,
      isDeleted: false,
    },
  });

  if (!staff) {
    throw new Error(
      "We couldn’t find an account with these details. Please check and try again."
    );
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await staff.update({
    password: hashedPassword,
    accessToken: null,
    otp: null,
    otpExpiryTime: null,
  });

  return {
    id: staff.id,
    role,
  };
};

export const staffChangePassword = async ({
  role,
  staffId,
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  let Model;

  switch (role) {
    case "security_guard":
      Model = SecurityGuard;
      break;

    case "service_team":
      Model = ServiceTeam;
      break;

    default:
      throw new Error("Invalid role");
  }

  const staff = await Model.findOne({
    where: {
      id: staffId,
      isDeleted: false,
      status: "ACTIVE",
    },
  });

  if (!staff) {
    throw new Error(
      "We couldn’t find an account with these details. Please check and try again."
    );
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    staff.password
  );

  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  // Match new & confirm password
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // Prevent using same password
  const isSamePassword = await bcrypt.compare(
    newPassword,
    staff.password
  );

  if (isSamePassword) {
    throw new Error(
      "New password cannot be the same as current password."
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await staff.update({
    password: hashedPassword,
  });

  return {};
};

export const getStaffProfile = async ({

  staffId,
    role,
}) => {
  let Model;

  switch (role) {
    case "security_guard":
      Model = SecurityGuard;
      break;

    case "service_team":
      Model = ServiceTeam;
      break;

    default:
      throw new Error("Invalid role");
  }

  const staff = await Model.findOne({
    where: {
      id: staffId,
      isDeleted: false,
      status: "ACTIVE",
    },
  });

  if (!staff) {
    throw new Error(
      "We couldn’t find an account with these details. Please check and try again."
    );
  }

  return {
    id: staff.id,
    profileImage: staff.profileImage,
    firstName: staff.firstNameEnglish,
    lastName: staff.lastNameEnglish,
    fullName: `${staff.firstNameEnglish} ${staff.lastNameEnglish}`,
    contactNumber: `${staff.countryCode} ${staff.contactNumber}`,
    email: staff.email,
    serviceLocation: staff.serviceLocation ?? null,
  };
};

export const staffLogout = async ({
 
  staffId,
   role,
}) => {
  let Model;

  switch (role) {
    case "security_guard":
      Model = SecurityGuard;
      break;

    case "service_team":
      Model = ServiceTeam;
      break;

    default:
      throw new Error("Invalid role");
  }

  const staff = await Model.findOne({
    where: {
      id: staffId,
      isDeleted: false,
    },
  });

  if (!staff) {
    throw new Error(
      "We couldn’t find an account with these details. Please check and try again."
    );
  }

  await staff.update({
    accessToken: null,
  });

  return {};
};