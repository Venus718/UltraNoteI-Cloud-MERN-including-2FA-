const express = require("express");
const router = express.Router();
const routeverivication = require("../middlewares/routeverivication");
const wallets = require("../controllers/wallets");
//wallets.getTransactions
router.post("/wallet_list", wallets.walletList);
router.get('/transactions/:address',routeverivication,wallets.getTransactions); // prettier-ignore
router.get('/status', routeverivication , wallets.getWalletStatus);
router.post("/deposits", wallets.walletsdepositscheck);
router.get('/rpcsettings', routeverivication, wallets.getRPCSettings);
router.post('/rpcsettings',routeverivication, wallets.setRPCSettings);
module.exports = router;
