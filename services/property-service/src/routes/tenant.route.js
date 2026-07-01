import express from "express";
import tanantController from '../controllers/tanant.controller.js';
import { verifyAdminToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/createTanant',verifyAdminToken, tanantController.createTenant);
router.get("/getAllTanant",verifyAdminToken,tanantController.getAllTenants)
router.put("/updateTanant/:id",verifyAdminToken, tanantController.updateTenant);
router.delete("/deleteTanant/:id",verifyAdminToken,tanantController.deleteTenant)


export default router;