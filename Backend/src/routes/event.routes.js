const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const validateObjectId = require('../middlewares/validateObjectId.middleware');

router.get('/', eventController.listEvents);
router.get('/:id', validateObjectId('id'), eventController.getEventById);

router.post('/', authMiddleware, eventController.createEvent);
router.put('/:id', authMiddleware, validateObjectId('id'), eventController.updateEvent);
router.delete('/:id', authMiddleware, validateObjectId('id'), eventController.deleteEvent);

module.exports = router;