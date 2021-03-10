const express = require('express');
const router = express.Router();
const login = require('../controllers/auth/login');
const register = require('../controllers/auth/register');


router.post('/login', login.loginUser);
router.post('/register',register.registerUser);

module.exports = router;