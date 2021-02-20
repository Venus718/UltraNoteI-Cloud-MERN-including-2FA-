const express = require('express');
const router = express.Router();
const change2fa = require('../controllers/user/settings');
const dashboard = require('../controllers/user/dashboard');
const contact = require('../controllers/user/address_book');

router.post('/change2fa', change2fa.change_2FA);
router.post('/dashboard', dashboard.getDepositsAndWithdrawls);
router.post('/add_contact', contact.addContact);
router.post('/delete_contact', contact.deleteContact);

module.exports = router;