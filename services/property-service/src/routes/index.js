import express from "express";
import amenityRoutes from "./amenity.route.js";
import propertyRoutes from "./property.route.js";
import tanantRoutes from "./tenant.route.js";
import uploadRoutes from "./uploadRoutes.js";
const router = express.Router();

router.use("/amenity", amenityRoutes);
router.use("/property", propertyRoutes);
router.use("/tanant", tanantRoutes);

export default router;