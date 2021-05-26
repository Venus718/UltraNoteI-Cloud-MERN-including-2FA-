const express = require('express');
const router = express.Router();

const wallets = require('../controllers/wallets');

router.post('/wallet_list', wallets.walletList);

module.exports = router;
