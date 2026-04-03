const express = require('express');
const eventController = require('../controllers/event.controller');
const registrationController = require('../controllers/registration.controller');
const { authMiddleware, authorize } = require('../middlewares/auth.middleware');
const validateObjectId = require('../middlewares/validateObjectId.middleware');
<<<<<<< HEAD
=======
const { ROLES } = require('../constants/roles');
>>>>>>> e5d7d39399b246ec7b103406ed563368cf8d6abc

const router = express.Router();

router.get('/', eventController.listEvents);
router.get('/:id', validateObjectId('id'), eventController.getEventById);

<<<<<<< HEAD
router.post('/', authMiddleware, authorize('organizer', 'admin'), eventController.createEvent);
=======
router.post('/', authMiddleware, authorize(ROLES.EVENT_PLANNER, ROLES.ADMIN), eventController.createEvent);
>>>>>>> e5d7d39399b246ec7b103406ed563368cf8d6abc
router.patch('/:id', authMiddleware, validateObjectId('id'), eventController.updateEvent);
router.delete('/:id', authMiddleware, validateObjectId('id'), eventController.deleteEvent);

router.post('/:id/register', authMiddleware, validateObjectId('id'), registrationController.registerForEvent);
router.delete('/:id/register', authMiddleware, validateObjectId('id'), registrationController.cancelMyRegistration);
router.get('/:id/registrations', authMiddleware, validateObjectId('id'), eventController.listEventRegistrations);

module.exports = router;
