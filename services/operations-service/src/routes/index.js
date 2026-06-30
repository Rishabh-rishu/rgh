import express from "express";
import securityGaurd from "./security.gaurd.route.js" 
import thirdParty from "../routes/thirdParty.route.js";
 

const router = express.Router()


router.use("/securityGaurd",securityGaurd)
router.use("/thirdParty",thirdParty)




export default router;