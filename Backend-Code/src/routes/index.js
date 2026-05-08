const express = require('express');
const authRoutes = require('./auth.routes');
const eventRoutes = require('./event.routes');
const registrationRoutes = require('./registration.routes');
const chatRoutes = require("./chat.routes");

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Backend is healthy' });
});

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/registrations', registrationRoutes);
router.use("/chat", chatRoutes);

module.exports = router;