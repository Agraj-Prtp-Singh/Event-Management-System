const express = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
<<<<<<< HEAD
=======
router.post('/otp/send', authController.sendOtp);
router.post('/otp/verify', authController.verifyOtp);
>>>>>>> e5d7d39399b246ec7b103406ed563368cf8d6abc
router.get('/me', authMiddleware, authController.getMyProfile);

module.exports = router;
