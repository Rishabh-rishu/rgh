import ServiceProviderService from "../services/serviceProvider.service.js";
import shared from "@rgh/shared"
const  { sendSuccessResponse, sendErrorResponse,HTTP_STATUS } = shared



export const createProvider = async (req, res) => {
  try {

    const provider = await ServiceProviderService.createProvider(req.body);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.CREATED,
      "Service Provider created successfully",
      provider
    );

  } catch (error) {

    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const getAllProviders = async (req, res) => {
  try {

    const data = await ServiceProviderService.getAllProviders(req.query);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Service Providers fetched successfully",
      data
    );

  } catch (error) {

    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const getProviderById = async (req, res) => {
  try {

    const data = await ServiceProviderService.getProviderById(req.params.id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Service Provider fetched successfully",
      data
    );

  } catch (error) {

    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const updateProvider = async (req, res) => {
  try {

    const data = await ServiceProviderService.updateProvider(
      req.params.id,
      req.body
    );

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Service Provider updated successfully",
      data
    );

  } catch (error) {

    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const deleteProvider = async (req, res) => {
  try {

    await ServiceProviderService.deleteProvider(req.params.id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Service Provider deleted successfully"
    );

  } catch (error) {

    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};