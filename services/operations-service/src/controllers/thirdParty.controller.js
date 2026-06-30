import shared from "@rgh/shared";
import ThirdPartyService from "../services/thirdparty.service.js";

const { HTTP_STATUS, sendErrorResponse, sendSuccessResponse } = shared;
export const createThirdParty = async (req, res) => {
  try {
    const thirdParty = await ThirdPartyService.createThirdParty(req.body);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.CREATED,
      "Third party created successfully",
      thirdParty
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const getAllThirdParties = async (req, res) => {
  try {
    const thirdParties = await ThirdPartyService.getAllThirdParties(req.query);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Third parties fetched successfully",
      thirdParties
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const getThirdPartyById = async (req, res) => {
  try {
    const { id } = req.params;

    const thirdParty = await ThirdPartyService.getThirdPartyById(id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Third party fetched successfully",
      thirdParty
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const updateThirdParty = async (req, res) => {
  try {
    const { id } = req.params;

    const thirdParty = await ThirdPartyService.updateThirdParty(
      id,
      req.body
    );

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Third party updated successfully",
      thirdParty
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const updateThirdPartyStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await ThirdPartyService.updateThirdPartyStatus(id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      result.message,
      result.data
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

export const deleteThirdParty = async (req, res) => {
  try {
    const { id } = req.params;

    await ThirdPartyService.deleteThirdParty(id);

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      "Third party deleted successfully"
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};