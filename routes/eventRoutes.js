const express = require('express');
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');

const router = express.Router();

// Create, Update and Delete an event
router.post('/', [authController.authenticate, authController.authorizeOrganizer] , eventController.createEvent);
router.put('/:id', [authController.authenticate, authController.authorizeOrganizer], eventController.updateEvent);
router.delete('/:id', [authController.authenticate, authController.authorizeOrganizer], eventController.deleteEvent);

// Get all/one event
router.get('/', authController.authenticate, eventController.getAllEvents);
router.get('/:id', authController.authenticate, eventController.getEvent);

// Register for an event
router.put('/:id/register', authController.authenticate, eventController.registerForEvent);

module.exports = router;