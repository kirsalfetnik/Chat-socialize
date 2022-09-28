const express = require('express');

// controller functions
const { signupUser, loginUser, getUsers } = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

// router.route('/').get(requireAuth, getUsers);
router.get('/', requireAuth, getUsers);

module.exports = router;