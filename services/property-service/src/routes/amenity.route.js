import express from "express";
import * as AmenityController from "../controllers/amenity.controller.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createAmenityValidator,
  updateAmenityValidator,
} from "../validator/amenity.validator.js";

const router = express.Router();

// Admin Routes

router.post(
  "/admin/createAmenity",
  validateRequest(createAmenityValidator),
  AmenityController.createAmenity
);

router.get(
  "/admin/getAllAmenities",
  AmenityController.getAllAmenities
);

router.get(
  "/admin/getAmenityById/:id",
  AmenityController.getAmenityById
);

router.put(
  "/admin/updateAmenity/:id",
  validateRequest(updateAmenityValidator),
  AmenityController.updateAmenity
);

router.patch(
  "/admin/updateAmenity/:id",
  AmenityController.updateAmenityStatus
);


router.delete(
  "/admin/deleteAmenity/:id",
  AmenityController.deleteAmenity
);

export default router;