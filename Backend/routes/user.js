const express = require('express');
const router = express.Router();
const change2fa = require('../controllers/user/settings');
const dashboard = require('../controllers/user/dashboard');

router.post('/change2fa', change2fa.change_2FA);
router.post('/dashboard', dashboard.getDepositsAndWithdrawls);

module.exports = router;