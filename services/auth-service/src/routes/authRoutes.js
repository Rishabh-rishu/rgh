import express from "express";
import adminRoutes from "./admin.routes.js";
import tenantRoutes from "./tenant.routes.js";
import securityGuardRoutes from "./securityGurad.route.js";
import thirdPartyRoutes from "./thirdparty.route.js"



const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/tenant", tenantRoutes);
router.use("/securityGuardRoutes", securityGuardRoutes);
router.use("/thirdPartyRoutes", thirdPartyRoutes);



export default router;
