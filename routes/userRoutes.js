const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/events', authController.authenticate, userController.getRegisteredEvents);

module.exports = router;