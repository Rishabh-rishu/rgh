import AmenityService from "../services/amenity.service.js";
import { sendSuccessResponse, sendErrorResponse } from "../utils/response.js";
import { HTTP_STATUS } from "../utils/httpStatus.js";

export const createAmenity = async (req, res) => {
  try {
    const amenity = await AmenityService.createAmenity(req.body);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.CREATED,
      "Amenity created successfully.",
      amenity
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const getAllAmenities = async (req, res) => {
  try {
    const amenities = await AmenityService.getAllAmenities(req.query);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Amenities fetched successfully.",
      amenities
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const getAmenityById = async (req, res) => {
  try {
    const amenity = await AmenityService.getAmenityById(req.params.id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Amenity fetched successfully.",
      amenity
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const updateAmenity = async (req, res) => {
  try {
    const amenity = await AmenityService.updateAmenity(
      req.params.id,
      req.body
    );

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Amenity updated successfully.",
      amenity
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const updateAmenityStatus = async (req, res) => {
  try {
    const amenity = await AmenityService.updateAmenityStatus(req.params.id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      `Amenity ${amenity.status.toLowerCase()} successfully.`,
      amenity
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const deleteAmenity = async (req, res) => {
  try {
    await AmenityService.deleteAmenity(req.params.id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Amenity deleted successfully."
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};