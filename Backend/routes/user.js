const express = require('express');
const router = express.Router();
const change2fa = require('../controllers/user/settings');
const dashboard = require('../controllers/user/dashboard');
const contact = require('../controllers/user/address_book');
const userActivity = require('../controllers/user/user_activity');

router.post('/change2fa', change2fa.change_2FA);
router.post('/dashboard', dashboard.getDepositsAndWithdrawls);
router.post('/add_contact', contact.addContact);
router.post('/delete_contact', contact.deleteContact);
router.post('/user_activity', userActivity.getUserActivity);

module.exports = router;