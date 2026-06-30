import express from "express";
import * as ThirdPartyController from "../controllers/thirdParty.controller.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  createThirdPartyValidator,
  updateThirdPartyValidator,
} from "../validator/thirdParty.validator.js";

const router = express.Router();

// Create Third Party
router.post(
  "/admin/createThirdParty",
  validateRequest(createThirdPartyValidator),
  ThirdPartyController.createThirdParty
);

// Get All Third Parties
router.get(
  "/admin/getAllThirdParties",
  ThirdPartyController.getAllThirdParties
);

// Get Third Party By ID
router.get(
  "/admin/getThirdParty/:id",
  ThirdPartyController.getThirdPartyById
);

// Update Third Party
router.put(
  "/admin/updateThirdParty/:id",
  validateRequest(updateThirdPartyValidator),
  ThirdPartyController.updateThirdParty
);

// Update Third Party Status (Active / Inactive)
router.patch(
  "/admin/updateThirdPartyStatus/:id",
  ThirdPartyController.updateThirdPartyStatus
);

// Delete Third Party (Soft Delete)
router.delete(
  "/admin/deleteThirdParty/:id",
  ThirdPartyController.deleteThirdParty
);

export default router;