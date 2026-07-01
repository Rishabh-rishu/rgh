import express from "express";
import * as propertyController from "../controllers/property.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createPropertyValidator,
  updatePropertyValidator,
} from "../validator/property.validator.js";
import { verifyAdminToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// admin routes

router.post(
  "/admin/",
  validateRequest(createPropertyValidator),verifyAdminToken,
  propertyController.createProperty
);

router.get(
  "/admin/",verifyAdminToken,
  propertyController.getAllProperties,
);

router.get(
  "/admin/:id",verifyAdminToken,
  propertyController.getPropertyById
);

router.put(
  "/admin/:id",
  validateRequest(updatePropertyValidator),verifyAdminToken,
  propertyController.updateProperty
);

router.patch(
  "/admin/:id/status",verifyAdminToken,
  propertyController.updatePropertyStatus
);

router.delete(
  "/admin/:id",verifyAdminToken,
  propertyController.deleteProperty
);

export default router;