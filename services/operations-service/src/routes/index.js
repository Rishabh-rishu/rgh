import express from "express";
import securityGaurd from "./security.gaurd.route.js" 
 

const router = express.Router()


router.use("/securityGaurd",securityGaurd)


export default router;