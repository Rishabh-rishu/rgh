import express from "express";
import propertyController from "../controllers/property.controller.js";


const router = express.Router();


router.post("/createProperty", propertyController.createProperty);

router.get("/getAllProperties", propertyController.getAllProperties);


export default router;