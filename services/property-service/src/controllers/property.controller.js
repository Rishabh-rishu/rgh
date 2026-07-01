import PropertyService from "../services/property.service.js";
import { sendSuccessResponse, sendErrorResponse } from "../utils/response.js";
import { HTTP_STATUS } from "../utils/httpStatus.js";

export const createProperty = async (req, res) => {
  try {
    const property = await PropertyService.createProperty(req.body);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.CREATED,
      "Property created successfully.",
      property
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const properties = await PropertyService.getAllProperties(req.query);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Properties fetched successfully.",
      properties
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await PropertyService.getPropertyById(req.params.id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Property fetched successfully.",
      property
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await PropertyService.updateProperty(
      req.params.id,
      req.body
    );

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Property updated successfully.",
      property
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const updatePropertyStatus = async (req, res) => {
  try {
    const property = await PropertyService.updatePropertyStatus(
      req.params.id,
      req.body.status
    );

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Property status updated successfully.",
      property
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const deleteProperty = async (req, res) => {
  try {
    await PropertyService.deleteProperty(req.params.id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Property deleted successfully."
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};