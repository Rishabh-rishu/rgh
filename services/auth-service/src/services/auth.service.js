import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import User from "../models/auth.model.js";
import Tenant from "../models/tenant.model.js";

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
    },
    RESET_TOKEN_EXPIRES_IN
  );

const verifyForgotPasswordOtp = ({ accessToken, otp, role }) => {
  const decoded = verifyToken(accessToken);

  // if (decoded.flow !== "forgot-password" || decoded.role !== role) {
  //   throw new Error("Invalid token flow");
  // }

  if (String(decoded.otp) !== String(otp)) {
    throw new Error("Invalid OTP");
  }

  return createResetPasswordToken(decoded);
};

const forgetPasswordForAdmin = async ({ resetToken, password}) => {
  const decoded = verifyToken(resetToken);

  // if (decoded.flow !== "reset-password" || decoded.role !== role) {
  //   throw new Error("Invalid token flow");
  // }

  const user = await User.findOne({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    throw new Error("Admin not found");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await Tenant.update({
    passwordHash,
    accessToken: null,
  });

  return {
    id: Tenant.id,
    email: Tenant.email,
  };
};

const resetUserPassword = async ({ resetToken, password,confirmPassword}) => {
  const decoded = verifyToken(resetToken);

  // if (decoded.flow !== "reset-password" || decoded.role !== role) {
  //   throw new Error("Invalid token flow");
  // }
   console.log(decoded);
  const user = await Tenant.findOne({
    where: {
      id: decoded.id,
    },
  });

   console.log(user);

  if (!user) {
    throw new Error("Tenant not found");
  }

  if (password !== confirmPassword) {
  throw new Error("Passwords do not match");
}

  const passwordHash = await bcrypt.hash(password, 10);
  

await Tenant.update(
  {
    password: passwordHash,
    accessToken: null,
  },
  {
    where: {
      id: user.id,
    },
  }
);

  return {
    id: Tenant.id,
    email: Tenant.email,
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

export const resetPassword = async ({ resetToken, password,confirmPassword }) =>
  resetUserPassword({
    resetToken,
    password,
    confirmPassword,
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


// Tenant Services

// export const tenantLogin = async ({
//   identifier,
//   countryCode,
//   password,
// }) => {
//   let whereClause = {
//     role: "tenant",
//   };

//   if (identifier.includes("@")) {
//     whereClause.email = identifier.toLowerCase();
//   } else {

//     if (!countryCode) {
//       throw new Error("Country code is required for phone login");
//     }

//     whereClause.phone = identifier;
//     whereClause.countryCode = countryCode;
//   }

//   const tenant = await User.findOne({
//     where: whereClause,
//   });

//   if (!tenant) {
//     throw new Error("Tenant not found");
//   }

//   if (tenant.isBlocked) {
//     throw new Error("Tenant is blocked");
//   }

//   const isPasswordValid = await bcrypt.compare(
//     password,
//     tenant.passwordHash
//   );

//   if (!isPasswordValid) {
//     throw new Error("Invalid credentials");
//   }

//   const accessToken = signToken(
//     {
//       id: tenant.id,
//       email: tenant.email,
//       role: tenant.role,
//     },
//     ACCESS_TOKEN_EXPIRES_IN
//   );

//   await tenant.update({ accessToken });

//   return {
//     tenantId: tenant.id,
//     email: tenant.email,
//     phoneNumber: tenant.phone,
//     countryCode: tenant.countryCode,
//     role: tenant.role,
//     accessToken,
//   };
// };



export const tenantLogin = async ({
  email,
  phoneNumber,
  password,
  countryCode,
}) => {
  let whereClause = {
    isDeleted: false,
    status: "ACTIVE",
  };
  
    // Login with Email
  if (email) {
    whereClause.email = email.toLowerCase();
  } else if (phoneNumber) {
    if (!countryCode) {
      throw new Error("Country code is required for phone login");
    }

    whereClause.phoneNumber = phoneNumber;
    whereClause.countryCode = countryCode;
  } else {
    throw new Error("Email or phone number is required");
  }

  const tenant = await Tenant.findOne({
    where: whereClause,
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(
    password,
    tenant.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Generate Access Token
  const accessToken = signToken(
    {
      id: tenant.id,
      email: tenant.email,
    },
    ACCESS_TOKEN_EXPIRES_IN
  );

  // Save Access Token
  await tenant.update({ accessToken });

  return {
    tenantId: tenant.id,
    firstName: tenant.firstNameEn,
    lastName: tenant.lastNameEn,
    email: tenant.email,
    countryCode:tenant.countryCode,
    phoneNumber: tenant.phoneNumber,
    accessToken,
  };
};

export const tenantForgotPassword = async ({
  email,
  phoneNumber,
  countryCode,
}) => {
  let whereClause = {
    isDeleted: false,
    status: "ACTIVE",
  };

  // Check whether identifier is email or phone
  if (email) {
    whereClause.email = email.toLowerCase();
  } else if (phoneNumber) {
    if (!countryCode) {
      throw new Error("Country code is required for phone login");
    }

    whereClause.phoneNumber = phoneNumber;
    whereClause.countryCode = countryCode;
  } else {
    throw new Error("Email or phone number is required");
  }


  const tenant = await Tenant.findOne({
    where: whereClause,
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  if (tenant.isBlocked) {
    throw new Error("Tenant is blocked");
  }

  const accessToken = createForgotPasswordToken(tenant);

  await tenant.update({ accessToken , otp :"123456",otpExpiryTime: Date.now() + 60 * 1000});

  return {
    // tenantId: tenant.id,
    // email: tenant.email,
    // phoneNumber: tenant.phone,
    // countryCode: tenant.countryCode,
    // role: tenant.role,
    accessToken,
  };
};

export const tenantVerifyForgotPasswordOtp = async ({ accessToken, otp }) => {

  const resetToken = verifyForgotPasswordOtp({
    accessToken,
    otp,
    role: "tenant",
  }); 
   const tenant = await Tenant.findOne({
    accessToken: accessToken,
  });

  if(!tenant){
    throw new Error("Invalid User");
  }

  if(!tenant.otp === otp){
    throw new Error("Invalid Otp");
  }

  if(tenant.otpExpiryTime < Date.now()){
    throw new Error("Otp Expired");
  }

  return { resetToken };
};


export const tenantResetPassword = async ({ resetToken, password ,confirmPassword}) =>
  resetUserPassword({
    resetToken,
    password,
    confirmPassword
  });


// export const tenantChangePassword = async ({
//   tenantId,
//   currentPassword,
//   newPassword,
// }) => {
//   const tenant = await Tenant.findOne({
//     where: {
//       id: tenantId
//     },
//   });

//   if (!tenant) {
//     throw new Error("Tenant not found");
//   }

//   if (tenant.isBlocked) {
//     throw new Error("Tenant is blocked");
//   }

//   const isPasswordValid = await bcrypt.compare(
//     currentPassword,
//     tenant.passwordHash
//   );

//   if (!isPasswordValid) {
//     throw new Error("Current password is incorrect");
//   }

//   // Prevent using the same password
//   const isSamePassword = await bcrypt.compare(
//     newPassword,
//     tenant.passwordHash
//   );

//   if (isSamePassword) {
//     throw new Error("New password cannot be the same as the current password");
//   }

//   const passwordHash = await bcrypt.hash(newPassword, 10);

//   await tenant.update({
//     passwordHash,
//     accessToken: null, // Optional: force re-login
//   });

//   return {
//     message: "Password changed successfully",
//   };
// };

export const tenantChangePassword = async ({
  tenantId,
  currentPassword,
  newPassword,
}) => {
  const tenant = await Tenant.findOne({
    where: {
      id: tenantId,
      isDeleted: false,
      status: "ACTIVE",
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    tenant.password
  );

  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  // Prevent using the same password
  const isSamePassword = await bcrypt.compare(
    newPassword,
    tenant.password
  );

  if (isSamePassword) {
    throw new Error("New password cannot be the same as the current password");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and invalidate access token
  await tenant.update({
    password: hashedPassword,
    accessToken: null,
  });

  return {
    success: true,
    message: "Password changed successfully",
  };
};

export const getTenantProfile = async (accessToken) => {
  const tenant = await Tenant.findOne({
    where: {
      accessToken,
        isDeleted: false,
       status: "ACTIVE",
    },
    attributes: {
      exclude: ["passwordHash", "accessToken"],
    },
  });
  console.log(tenant)

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  if (tenant.isBlocked) {
    throw new Error("Tenant is blocked");
  }

  return tenant;
};

export const updateTenantProfiles =   async(tenantId, data) =>{

   console.log(data);
    const tenant = await Tenant.findOne({
      where: {
        // id: tenantId,
        id: "ebc2215e-c96b-4b6d-a91e-1adf3bb2ed76",
        isDeleted: false,
      },
    });

   

    if (!tenant) {
      throw new Error("Tenant not found");
    }



    // Check if email is being updated
    if (data.email && data.email !== tenant.email) {
      const existingTenant = await Tenant.findOne({
        where: {
          email: data.email,
          isDeleted: false,
        },
      });

  
      if (existingTenant) {
        throw new Error("Email already exists");
      }
    }

    // Validate lease dates
    if (
      data.leaseStartDate &&
      data.leaseEndDate &&
      new Date(data.leaseStartDate) >=
        new Date(data.leaseEndDate)
    ) {
      throw new Error(
        "Lease end date must be greater than lease start date"
      );
    }

    await tenant.update({
      firstNameEn: data.firstNameEn ?? tenant.firstNameEn,
      firstNameAr: data.firstNameAr ?? tenant.firstNameAr,
      lastNameEn: data.lastNameEn ?? tenant.lastNameEn,
      lastNameAr: data.lastNameAr ?? tenant.lastNameAr,
      countryCode: data.countryCode ?? tenant.countryCode,
      phoneNumber: data.phoneNumber ?? tenant.phoneNumber,
      email: data.email ?? tenant.email,
      joiningDate: data.joiningDate ?? tenant.joiningDate,
      location: data.location ?? tenant.location,
      propertyType: data.propertyType ?? tenant.propertyType,
      propertyId: data.propertyId ?? tenant.propertyId,
      buildingNo: data.buildingNo ?? tenant.buildingNo,
      unitNo: data.unitNo ?? tenant.unitNo,
      tenantPlan: data.tenantPlan ?? tenant.tenantPlan,
      leaseType: data.leaseType ?? tenant.leaseType,
      leaseStartDate:
        data.leaseStartDate ?? tenant.leaseStartDate,
      leaseEndDate:
        data.leaseEndDate ?? tenant.leaseEndDate,
      documents: data.documents ?? tenant.documents,
      status: data.status ?? tenant.status,
    });

    const response = tenant.toJSON();

    delete response.password;
    delete response.accessToken;

    return response;
  }







  // Security Guard Services 

export const securityGuardLogin = async ({ identifier }) => {
  const securityGuard = await User.findOne({
    where: {
      role: "security_guard",
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
  if (!securityGuard) {
    throw new Error("securityGuard not found");
  }

  if (securityGuard.isBlocked) {
    throw new Error("securityGuard is blocked");
  }

  const accessToken = signToken(
    {
      id: securityGuard.id,
      otp: OTP,
      role: securityGuard.role,
      flow: "securityGuard-login",
    },
    OTP_TOKEN_EXPIRES_IN
  );
 
  await securityGuard.update({ accessToken });

  return { accessToken };
};

export const verifySecurityGuardLoginOtp = async ({ accessToken, otp }) => {
  const decoded = verifyToken(accessToken);

  if (decoded.flow !== "securityGuard-login" || decoded.role !== "security_guard") {
    throw new Error("Invalid token");
  }

  if (String(decoded.otp) !== String(otp)) {
    throw new Error("Invalid OTP");
  }

  const securityGuard = await User.findOne({
    where: {
      id: decoded.id,
      role: "security_guard",
    },
  });

  if (!securityGuard) {
    throw new Error("Security Guard not found");
  }

  const loginToken = signToken(
    {
      id: securityGuard.id,
      email: securityGuard.email,
      role: securityGuard.role,
    },
    ACCESS_TOKEN_EXPIRES_IN
  );

  await securityGuard.update({ accessToken: loginToken });

  return {
    tenantId: securityGuard.id,
    email: securityGuard.email,
    role: securityGuard.role,
    accessToken: loginToken,
  };
};

export const securityGuardForgotPassword = async ({ email }) => {
  const securityGuard = await User.findOne({
    where: {
      email,
      role: "security_guard",
    },
  });

  if (!securityGuard) {
    throw new Error("Security Guard not found");
  }

  if (securityGuard.isBlocked) {
    throw new Error("Security Guard is blocked");
  }

  const accessToken = createForgotPasswordToken(securityGuard);

  await securityGuard.update({ accessToken });

  return { accessToken };
};

export const securityGuardVerifyForgotPasswordOtp = async ({ accessToken, otp }) => {
  const resetToken = verifyForgotPasswordOtp({
    accessToken,
    otp,
    role: "security_guard",
  });

  return { resetToken };
};

export const securityGuardResetPassword = async ({ resetToken, password }) =>
  resetUserPassword({
    resetToken,
    password,
    role: "security_guard",
  });