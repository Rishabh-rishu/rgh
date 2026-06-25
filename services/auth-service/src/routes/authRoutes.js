const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();


// admin auth 
router.post('/admin-login', authController.adminLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-forgot-password-otp', authController.verifyForgotPasswordOtp);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authController.logout);

//Tanant auth

router.post("/tanant-login",authController.tanantLogin)
router.post("/verify-tanant-login-otp",authController.verifyLoginOtp)
router.post("/tenant-forgot-password",authController.TenantForgotPassword)
router.post("/tenant-reset-password",authController.TenantResetPassword)



module.exports = router;
