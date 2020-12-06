const express = require('express');
const router = express.Router();
const login = require('../controllers/auth/login');
const register = require('../controllers/auth/register');


router.post('/signin', login.loginUser);
router.post('/signup', register.registerUser);
router.get('/activate/:token', register.activateAccount);


module.exports = router;
