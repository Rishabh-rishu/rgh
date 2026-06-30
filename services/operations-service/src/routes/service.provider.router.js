import express from "express";

import {
  createProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
} from "../controllers/serviceProvider.controller.js";

import validate from "../middleware/validate.js";
import { createProviderValidator, updateProviderValidator } from "../validators/serviceProviderValidator.js";

const router = express.Router();

router.post("/", validate(createProviderValidator), createProvider);

router.get("/", getAllProviders);

router.get("/:id", getProviderById);

router.put("/:id", validate(updateProviderValidator), updateProvider);

router.delete("/:id", deleteProvider);

export default router;