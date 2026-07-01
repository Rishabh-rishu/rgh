import express from 'express';
import { success, authenticate, authorize } from '@rgh/shared';
import { db } from '../lib/db.js'; // Note: ES Modules often require the file extension (.js)
import tanantController from '../controllers/tanant.controller.js';
import  amenityController from "../controllers/amenity.controller.js";
import propertyController from "../controllers/property.controller.js";


const router = express.Router();

// Tanant Route
router.post('/createTanant', tanantController.createTenant);
router.get("/getAllTanant",tanantController.getAllTenants)
router.put("/updateTanant/:id", tanantController.updateTenant);
router.delete("/deleteTanant/:id",tanantController.deleteTenant)


// Amenity Management

router.post("/createAmenity",amenityController.createAmenity);

router.get("/getAllAmenity", amenityController.getAllAmenities);

router.get("/getAmenityById/:id",amenityController.getAmenity);

router.put("/updateAmenity/:id", amenityController.updateAmenity);

router.delete("/deleteAmenity/:id", amenityController.deleteAmenity);


// Property Management

router.post("/createProperty", propertyController.createProperty);

router.get("/getAllProperties", propertyController.getAllProperties);

// router.get("/getPropertyById/:id",propertyController.);

// router.put("/updateProperty/:id",propertyController.updateProperty);

// router.delete("/deleteProperty/:id",propertyController.deleteProperty);




export default router;