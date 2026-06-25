import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import User from "../models/auth.model.js";


export const adminLogin = async ({
  email,
  password,
}) => {
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

  const isPasswordValid = await bcrypt.compare(
    password,
    admin.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const payload = {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  await admin.update({
    accessToken,
  });

  return {
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
    accessToken,
  };
};

export const forgotPassword = async ({
  email,
}) => {
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

  const otp = "123456";

  const payload = {
    id: admin.id,
    email: admin.email,
    otp,
    flow: "forgot-password",
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: "2m",
    }
  );

  await admin.update({
    accessToken,
  });

  // Send OTP here

  return {
    accessToken,
  };
};

export const verifyForgotPasswordOtpService = async ({
  accessToken,
  otp,
}) => {
  
  const decoded = jwt.verify(
    accessToken,
    process.env.JWT_SECRET
  );

  if (decoded.flow !== "forgot-password") {
    throw new Error("Invalid token flow");
  }

  if (String(decoded.otp) !== String(otp)) {
    throw new Error("Invalid OTP");
  }

  const resetToken = jwt.sign(
    {
      id: decoded.id,
      email: decoded.email,
      flow: "reset-password",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  return {
    resetToken,
  };
};

export const resetPassword = async ({
  resetToken,
  password,
}) => {
   const decoded = jwt.verify(
    resetToken,
    process.env.JWT_SECRET
  );

  if (decoded.flow !== "reset-password") {
    throw new Error("Invalid token flow");
  }

  const user = await User.findByPk(decoded.id);

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

  await admin.update({
    accessToken: null,
  });

  return true;
};


// Tanant Service

export const tenantLogin = async ({
    identifier
  }) => {
    const tenant =
      await User.findOne({
        where: {
          role: "tenant",
          [Op.or]: [
            {
              email:
                identifier,
            },
            {
              phone:
                identifier,
            },
          ],
        },
      });

    if (!tenant) {
      throw new Error(
        "Tenant not found"
      );
    }

    // const isMatch =
    //   await bcrypt.compare(
    //     password,
    //     tenant.passwordHash
    //   );

    // if (!isMatch) {
    //   throw new Error(
    //     "Invalid password"
    //   );
    // }

    const otp = "123456";

    const tempToken = jwt.sign(
      {
        id: tenant.id,
        otp,
        flow:
          "tenant-login",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    return {
      accessToken:
        tempToken,
    };
  };

export const verifyTenantLoginOtp = async ({
    accessToken,
    otp,
  }) => {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    );

    if (
      decoded.flow !==
      "tenant-login"
    ) {
      throw new Error(
        "Invalid token"
      );
    }

    if (decoded.otp !== otp) {
      throw new Error(
        "Invalid OTP"
      );
    }

    const tenant =
      await User.findByPk(
        decoded.id
      );

    const loginToken = jwt.sign(
      {
        id: tenant.id,
        role: tenant.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await tenant.update({
      accessToken:
        loginToken,
    });

    return {
      tenant
    };
  };

export const tenantForgotPassword = async ({
  email,
}) => {
  const tenant = await User.findOne({
    where: {
      email,
      role: "tenant",
    },
  });

  console.log(tenant);
  if (!tenant) {
    throw new Error("Tenant not found");
  }

  if (tenant.isBlocked) {
    throw new Error("Tenant is blocked");
  }

  const otp = "123456";

  const payload = {
    id: tenant.id,
    email: tenant.email,
    otp,
    flow: "forgot-password",
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: "2m",
    }
  );

  await tenant.update({
    accessToken,
  });

  // Send OTP here

  return {
    accessToken,
  };
};  

export const tenantResetPassword = async ({
  resetToken,
  password,
}) => {
   const decoded = jwt.verify(
    resetToken,
    process.env.JWT_SECRET
  );

  if (decoded.flow !== "forgot-password") {
    throw new Error("Invalid token flow");
  }

  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw new Error("Tenant not found");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  console.log(passwordHash)

  await user.update({
    passwordHash,
    accessToken: null,
  });

  return {
    id: user.id,
    email: user.email,
  };
};


