



import jwt from "jsonwebtoken";
import shared from "@rgh/shared";
import Admin from "../models/auth.model.js";

const { sendErrorResponse } = shared;
export const getTokenFromAuthorizationHeader = (authHeader) => {
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() === "bearer" && token) {
    return token;
  }

  return authHeader;
};

const extractToken = (req) => {
    console.log("req.headers",req.headers)
  const authHeader =
    req.headers.authorization || req.headers.Authorization;

  if (authHeader && typeof authHeader === "string") {
    const parts = authHeader.split(" ");

    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      return parts[1];
    }
  }

  const token =
    req.headers.authorization ||
    req.headers["x-access-token"];

  return token || null;
};




export const verifyAdminToken = async (
  req,
  res,
  next
) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return sendErrorResponse(
        res,
        401,
        "Unauthorized"
      );
    }

    if (!process.env.JWT_SECRET) {
      return sendErrorResponse(
        res,
        400,
        "JWT secret not configured"
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const admin = await Admin.findOne({
      where: {
        id: decoded.id,
      },
    });

    if (!admin) {
      return sendErrorResponse(
        res,
        404,
        "Admin not found"
      );
    }


    // Optional: Session validation
    if (
      admin.accessToken &&
      admin.accessToken !== token
    ) {
      return sendErrorResponse(
        res,
        401,
        "Session expired. Please login again."
      );
    }

    req.admin = admin;
    req.user = admin;

    next();
  } catch (error) {
    return sendErrorResponse(
      res,
      401,
      error.message || "Invalid or expired token"
    );
  }
};


