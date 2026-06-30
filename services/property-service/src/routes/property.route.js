import express from "express";
import * as propertyController from "../controllers/property.controller.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createPropertyValidator,
  updatePropertyValidator,
} from "../validator/property.validator.js";

const router = express.Router();

// admin routes

router.post(
  "/admin/",
  validateRequest(createPropertyValidator),
  propertyController.createProperty
);

router.get(
  "/admin/",
  propertyController.getAllProperties
);

router.get(
  "/admin/:id",
  propertyController.getPropertyById
);

router.put(
  "/admin/:id",
  validateRequest(updatePropertyValidator),
  propertyController.updateProperty
);

router.patch(
  "/admin/:id/status",
  propertyController.updatePropertyStatus
);

router.delete(
  "/admin/:id",
  propertyController.deleteProperty
);

export default router;