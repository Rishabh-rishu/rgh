import SecurityGuardService from "../services/securityGaurd.service.js";
import shared from "@rgh/shared"
const  { sendSuccessResponse, sendErrorResponse,HTTP_STATUS } = shared


 const createSecurityGuard = async (req, res) => {
  try {
    const result = await SecurityGuardService.create(req.body);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.CREATED,
      "Security Guard created successfully",
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

 const getAllSecurityGuards = async (req, res) => {
  try {
    const result = await SecurityGuardService.getAll(req.query);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Security Guards fetched successfully",
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

 const getSecurityGuardById = async (req, res) => {
  try {
    const result = await SecurityGuardService.getById(req.params.id);

    if (!result) {
      return sendErrorResponse(
        res,
        HTTP_STATUS.NOT_FOUND,
        "Security Guard not found"
      );
    }

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Security Guard fetched successfully",
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

 const updateSecurityGuard = async (req, res) => {
  try {
    const result = await SecurityGuardService.update(
      req.params.id,
      req.body
    );

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Security Guard updated successfully",
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

const deleteSecurityGuard = async (req, res) => {
  try {
    await SecurityGuardService.delete(req.params.id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Security Guard deleted successfully"
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};


export  default {
    createSecurityGuard,
    getAllSecurityGuards,
    getSecurityGuardById,
    updateSecurityGuard,
    deleteSecurityGuard
}