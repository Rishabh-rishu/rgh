import express from "express";
import adminRoutes from "./admin.routes.js";
import tenantRoutes from "./tenant.routes.js";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/tenant", tenantRoutes);

export default router;
