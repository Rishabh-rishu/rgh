import express from "express";
import * as AmenityController from "../controllers/amenity.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createAmenityValidator,
  updateAmenityValidator,
} from "../validator/amenity.validator.js";
import { verifyAdminToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin Routes

router.post(
  "/admin/createAmenity",
  validateRequest(createAmenityValidator),verifyAdminToken,
  AmenityController.createAmenity
);

router.get(
  "/admin/getAllAmenities",verifyAdminToken,
  AmenityController.getAllAmenities
);

router.get(
  "/admin/getAmenityById/:id",verifyAdminToken,
  AmenityController.getAmenityById
);

router.put(
  "/admin/updateAmenity/:id",
  validateRequest(updateAmenityValidator),verifyAdminToken,
  AmenityController.updateAmenity
);

router.patch(
  "/admin/updateAmenity/:id",verifyAdminToken,
  AmenityController.updateAmenityStatus
);


router.delete(
  "/admin/deleteAmenity/:id",verifyAdminToken,
  AmenityController.deleteAmenity
);

export default router;