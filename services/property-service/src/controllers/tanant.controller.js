import TenantService from "../services/tanant.service.js";
import {
  sendSuccessResponse,
  sendErrorResponse,
} from "../utils/response.js";
import { HTTP_STATUS } from "../utils/httpStatus.js";

 const createTenant = async (req, res) => {
  try {
    const tenant = await TenantService.createTenant(req.body);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.CREATED,
      "Tenant created successfully",
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

 const getAllTenants = async (req, res) => {
  try {
    const tenants = await TenantService.getAllTenants(req.query);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Tenants fetched successfully",
      tenants
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

const updateTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await TenantService.updateTenant(
      id,
      req.body
    );

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Tenant updated successfully",
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

const deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;

    await TenantService.deleteTenant(id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Tenant deleted successfully"
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};



export default {
  createTenant,
  getAllTenants,
  updateTenant,
  deleteTenant
};