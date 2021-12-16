const express = require("express");
const router = express.Router();
const routeverivication = require("../middlewares/routeverivication");
const wallets = require("../controllers/wallets");
//wallets.getTransactions
router.post("/wallet_list", wallets.walletList);
router.get('/transactions/:address',routeverivication,wallets.getTransactions); // prettier-ignore
// router.get('/status', wallets.getWalletStatus);
router.post("/deposits", wallets.walletsdepositscheck);
module.exports = router;
