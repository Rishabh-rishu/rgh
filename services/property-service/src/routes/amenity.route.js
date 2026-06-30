import express from "express";
import  amenityController from "../controllers/amenity.controller.js";



const router = express.Router();

router.post("/createAmenity",amenityController.createAmenity);

router.get("/getAllAmenity", amenityController.getAllAmenities);

router.get("/getAmenityById/:id",amenityController.getAmenity);

router.put("/updateAmenity/:id", amenityController.updateAmenity);

router.delete("/deleteAmenity/:id", amenityController.deleteAmenity);




export default router;