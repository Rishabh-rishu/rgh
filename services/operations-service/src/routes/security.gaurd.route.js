import express from 'express'
import securityGaurdController from '../controllers/securityGaurd.contoller.js';



const router = express.Router()

router.post("/",securityGaurdController.createSecurityGuard);
router.get("/",securityGaurdController.getAllSecurityGuards);
router.put("/",securityGaurdController.updateSecurityGuard);
router.delete("/",securityGaurdController.deleteSecurityGuard)


 export default router