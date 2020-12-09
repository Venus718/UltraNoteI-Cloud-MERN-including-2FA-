const express = require('express');
const router = express.Router();
const login = require('../controllers/auth/login');
const register = require('../controllers/auth/register');
const reset_password = require('../controllers/auth/reset_password');
const twoFA = require('../controllers/auth/two_fact_auth');


router.post('/signin', login.loginUser);
router.post('/signup', register.registerUser);
router.post('/resetmail', reset_password.resetPassword_snedingMail);
router.post('/newpassword/:token', reset_password.resetPassword_newPassword);
router.post('/twofacode/:token', twoFA.permmision);

router.get('/activate/:token', register.activateAccount);
router.get('/setnewpassword/:token', reset_password.resetPassword_decodemail);




module.exports = router;
