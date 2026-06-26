import express from "express";
import tanantController from '../controllers/tanant.controller.js';

const router = express.Router();

router.post('/createTanant', tanantController.createTenant);
router.get("/getAllTanant",tanantController.getAllTenants)
router.put("/updateTanant/:id", tanantController.updateTenant);
router.delete("/deleteTanant/:id",tanantController.deleteTenant)


export default router;