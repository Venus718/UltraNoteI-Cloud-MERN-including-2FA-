const express = require('express');
const router = express.Router();
const change2fa = require('../controllers/user/settings');
const dashboard = require('../controllers/user/dashboard');
const contact = require('../controllers/user/add_contact');

router.post('/change2fa', change2fa.change_2FA);
router.post('/dashboard', dashboard.getDepositsAndWithdrawls);
router.get('/get_users', contact.getAllUsers);
router.post('/add_contact', contact.addContact);
router.post('/get_contact_list', contact.getContactList);

module.exports = router;