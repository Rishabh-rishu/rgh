import express from "express";
import * as ThirdPartyController from "../controllers/thirdParty.controller.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createThirdPartyValidator,
  updateThirdPartyValidator,
} from "../validator/thirdParty.validator.js";
import { verifyAdminToken } from "../middlewares/auth.middleware.js";


const router = express.Router();

// Create Third Party
router.post(
  "/admin/createThirdParty",
  validateRequest(createThirdPartyValidator),verifyAdminToken,
  ThirdPartyController.createThirdParty
);

// Get All Third Parties
router.get(
  "/admin/getAllThirdParties",verifyAdminToken,
  ThirdPartyController.getAllThirdParties
);

// Get Third Party By ID
router.get(
  "/admin/getThirdParty/:id",verifyAdminToken,
  ThirdPartyController.getThirdPartyById
);

// Update Third Party
router.put(
  "/admin/updateThirdParty/:id",verifyAdminToken,
  validateRequest(updateThirdPartyValidator),
  ThirdPartyController.updateThirdParty
);

// Update Third Party Status (Active / Inactive)
router.patch(
  "/admin/updateThirdPartyStatus/:id",verifyAdminToken,
  ThirdPartyController.updateThirdPartyStatus
);

// Delete Third Party (Soft Delete)
router.delete(
  "/admin/deleteThirdParty/:id",verifyAdminToken,
  ThirdPartyController.deleteThirdParty
);

export default router;