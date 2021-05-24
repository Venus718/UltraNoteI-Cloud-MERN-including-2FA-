const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

router.post('/user_list', users.userList);
router.post('/suspended_user', users.suspendedUser);
router.post('/deleted_user', users.deletedUser);
router.post('/pending_email', users.pendingEmial);
router.post('/add_user', users.addUser);
router.post('/suspend_user', users.suspendUser);
router.post('/delete_user', users.deleteUser);
router.post('/activate_email', users.activateEmail);

module.exports = router;
