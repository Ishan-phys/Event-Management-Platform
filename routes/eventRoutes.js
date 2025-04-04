const express = require('express');
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');

const router = express.Router();

// Creat/Update/Delete an event
router.post('/', [authController.authenticate, authController.authorizeOrganizer] , eventController.createEvent);
router.put('/:id', [authController.authenticate, authController.authorizeOrganizer], eventController.updateEvent);
router.delete('/:id', [authController.authenticate, authController.authorizeOrganizer], eventController.deleteEvent);

router.get('/', authController.authenticate, eventController.getAllEvents);
router.get('/:id', authController.authenticate, eventController.getEvent);

router.post('/:id/register', authController.authenticate, eventController.registerForEvent);

module.exports = router;