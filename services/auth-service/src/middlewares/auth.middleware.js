



import jwt from "jsonwebtoken";
import shared from "@rgh/shared";
import ThirdParty from "../models/thirdparty.model.js";

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

export const verifyThirdPartyToken = async (
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

    const thirdParty = await ThirdParty.findOne({
      where: {
        id: decoded.id,
        isDeleted: false,
      },
    });

    if (!thirdParty) {
      return sendErrorResponse(
        res,
        404,
        "Third party not found"
      );
    }

    if (thirdParty.status !== "ACTIVE") {
      return sendErrorResponse(
        res,
        403,
        "Third party is inactive"
      );
    }

    // Optional: Session validation
    if (
      thirdParty.accessToken &&
      thirdParty.accessToken !== token
    ) {
      return sendErrorResponse(
        res,
        401,
        "Session expired. Please login again."
      );
    }

    req.thirdParty = thirdParty;
    req.user = thirdParty;

    next();
  } catch (error) {
    return sendErrorResponse(
      res,
      401,
      error.message || "Invalid or expired token"
    );
  }
};


export const verifyServiceTeamToken = async (
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

    const serviceTeam = await ServiceTeam.findOne({
      where: {
        id: decoded.id,
        isDeleted: false,
      },
    });

    if (!serviceTeam) {
      return sendErrorResponse(
        res,
        404,
        "Service team member not found"
      );
    }

    if (serviceTeam.status !== "ACTIVE") {
      return sendErrorResponse(
        res,
        403,
        "Service team member is inactive"
      );
    }

    if (
      serviceTeam.accessToken &&
      serviceTeam.accessToken !== token
    ) {
      return sendErrorResponse(
        res,
        401,
        "Session expired. Please login again."
      );
    }

    req.serviceTeam = serviceTeam;
    req.user = serviceTeam;

    next();
  } catch (error) {
    return sendErrorResponse(
      res,
      401,
      error.message || "Invalid or expired token"
    );
  }
};