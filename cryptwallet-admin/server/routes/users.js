const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

router.post('/user_list', users.userList);
// router.post('/add_user', users.addUser);
// router.get('/suspended_user', users.suspendedUser);
// router.get('/deleted_user', users.deletedUser);
// router.get('/pending_email', users.pendingEmail);

module.exports = router;
